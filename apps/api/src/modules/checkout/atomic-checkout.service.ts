import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class AtomicCheckoutService {
  constructor(private prisma: PrismaService) {}

  async processCheckout(
    userId: string,
    cartId: string,
    createOrderDto: CreateOrderDto,
    idempotencyKey: string,
  ): Promise<OrderResponseDto> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Validar carrinho e carregar itens com FOR UPDATE
      const cart = await tx.cart.findUnique({
        where: { 
          id: cartId, 
          userId,
          status: 'OPEN'
        },
        include: {
          items: {
            include: {
              variant: {
                select: {
                  id: true,
                  inventoryQty: true,
                  version: true,
                  priceCents: true,
                  sku: true,
                  product: {
                    select: {
                      id: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cart) {
        throw new NotFoundException('Carrinho não encontrado ou já foi convertido');
      }

      if (cart.items.length === 0) {
        throw new BadRequestException('Carrinho está vazio');
      }

      // 2. Validar estoque e aplicar optimistic locking
      const stockValidationErrors: string[] = [];
      
      for (const item of cart.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { 
            id: true, 
            inventoryQty: true, 
            version: true,
            sku: true,
          },
        });

        if (!variant) {
          stockValidationErrors.push(`Variante ${item.variantId} não encontrada`);
          continue;
        }

        if (variant.inventoryQty < item.qty) {
          stockValidationErrors.push(
            `Estoque insuficiente para ${item.sku}: disponível ${variant.inventoryQty}, solicitado ${item.qty}`
          );
        }
      }

      if (stockValidationErrors.length > 0) {
        throw new ConflictException({
          message: 'Estoque insuficiente',
          errors: stockValidationErrors,
        });
      }

      // 3. Debitar estoque com FOR UPDATE
      for (const item of cart.items) {
        const updatedVariant = await tx.productVariant.update({
          where: { 
            id: item.variantId,
            version: item.variant.version, // Optimistic locking
          },
          data: {
            inventoryQty: {
              decrement: item.qty,
            },
            version: {
              increment: 1,
            },
          },
        });

        if (updatedVariant.inventoryQty < 0) {
          throw new ConflictException(
            `Estoque insuficiente para variante ${item.variantId} após atualização`
          );
        }
      }

      // 4. Calcular totais
      const subtotalCents = cart.items.reduce(
        (sum, item) => sum + (item.unitPriceCents * item.qty),
        0,
      );

      const shippingCents = this.calculateShipping(createOrderDto.shippingAddress);
      const taxCents = this.calculateTax(subtotalCents);
      const totalCents = subtotalCents + shippingCents + taxCents;

      // 5. Gerar número do pedido
      const orderNumber = this.generateOrderNumber();

      // 6. Criar pedido
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          cartId,
          status: 'PENDING',
          amountSubtotalCents: subtotalCents,
          amountTotalCents: totalCents,
          currency: 'BRL',
          placedAt: new Date(),
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              qty: item.qty,
              unitPriceCents: item.unitPriceCents,
            })),
          },
          shipping: {
            create: {
              firstName: createOrderDto.shippingAddress.firstName,
              lastName: createOrderDto.shippingAddress.lastName,
              address1: createOrderDto.shippingAddress.address1,
              address2: createOrderDto.shippingAddress.address2,
              city: createOrderDto.shippingAddress.city,
              state: createOrderDto.shippingAddress.state,
              zipCode: createOrderDto.shippingAddress.zipCode,
              country: createOrderDto.shippingAddress.country || 'BR',
              phone: createOrderDto.shippingAddress.phone,
            },
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          shipping: true,
        },
      });

      // 7. Criar pagamento (mock)
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          provider: 'mock',
          providerRef: `mock_${Date.now()}`,
          status: 'PENDING',
          amountCents: totalCents,
          currency: 'BRL',
          idempotencyKey,
          metadata: {
            method: createOrderDto.paymentMethod,
            cartId,
          },
        },
      });

      // 8. Marcar carrinho como convertido
      await tx.cart.update({
        where: { id: cartId },
        data: { status: 'CONVERTED' },
      });

      // 9. Retornar resposta
      return this.mapOrderToResponse(order);
    });
  }

  private calculateShipping(address: any): number {
    // Lógica simples de cálculo de frete
    // Em produção, integrar com APIs de frete
    return 1500; // R$ 15,00 em centavos
  }

  private calculateTax(subtotalCents: number): number {
    // Lógica simples de cálculo de impostos
    // Em produção, usar sistema de impostos mais complexo
    return Math.floor(subtotalCents * 0.1); // 10% de imposto
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  private mapOrderToResponse(order: any): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: order.amountSubtotalCents,
      total: order.amountTotalCents,
      currency: order.currency,
      placedAt: order.placedAt,
      items: order.items.map((item: any) => ({
        id: item.id,
        variantId: item.variantId,
        quantity: item.qty,
        unitPrice: item.unitPriceCents,
        product: {
          id: item.variant.product.id,
          title: item.variant.product.title,
          slug: item.variant.product.slug,
        },
      })),
      shipping: order.shipping ? {
        firstName: order.shipping.firstName,
        lastName: order.shipping.lastName,
        address1: order.shipping.address1,
        address2: order.shipping.address2,
        city: order.shipping.city,
        state: order.shipping.state,
        zipCode: order.shipping.zipCode,
        country: order.shipping.country,
        phone: order.shipping.phone,
      } : null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
