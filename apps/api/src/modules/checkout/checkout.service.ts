import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, OrderStatus, PaymentStatus } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Carrinho vazio');
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(`Produto ${item.product.name} não está disponível`);
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = this.calculateShippingCost(subtotal);
    const taxAmount = this.calculateTax(subtotal);
    const discountAmount = await this.calculateDiscount(createOrderDto.couponCode, subtotal);
    const total = subtotal + shippingCost + taxAmount - discountAmount;

    const orderNumber = this.generateOrderNumber();

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: OrderStatus.PENDING,
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount,
        total,
        paymentMethod: createOrderDto.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        shippingAddress: {
          create: createOrderDto.shippingAddress,
        },
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        notes: createOrderDto.notes,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.mapOrderToResponse(order);
  }

  async getOrder(userId: string, orderId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return this.mapOrderToResponse(order);
  }

  async getUserOrders(userId: string, page = 1, limit = 10): Promise<{
    orders: OrderResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
          shippingAddress: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({
        where: { userId },
      }),
    ]);

    return {
      orders: orders.map((order) => this.mapOrderToResponse(order)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateOrderStatusDto.status,
        paymentStatus: updateOrderStatusDto.paymentStatus,
        notes: updateOrderStatusDto.notes,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    return this.mapOrderToResponse(updatedOrder);
  }

  private calculateShippingCost(subtotal: number): number {
    if (subtotal >= 10000) {
      return 0;
    }
    return 1500;
  }

  private calculateTax(subtotal: number): number {
    return Math.round(subtotal * 0.1);
  }

  private async calculateDiscount(couponCode?: string, subtotal?: number): Promise<number> {
    if (!couponCode || !subtotal) {
      return 0;
    }

    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code: couponCode,
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!coupon) {
      return 0;
    }

    if (coupon.type === 'PERCENTAGE') {
      return Math.round(subtotal * (coupon.value / 100));
    } else {
      return coupon.value;
    }
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
      userId: order.userId,
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      taxAmount: order.taxAmount,
      discountAmount: order.discountAmount,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        product: item.product,
      })),
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
