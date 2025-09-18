import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import * as crypto from 'crypto';

@Injectable()
export class GuestCartService {
  constructor(private prisma: PrismaService) {}

  async createCart() {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

    const cart = await this.prisma.cart.create({
      data: {
        sessionId,
        expiresAt,
      },
    });

    return cart;
  }

  async addItem(cartId: string, sessionId: string, addToCartDto: AddToCartDto) {
    await this.validateCartAccess(cartId, sessionId);

    const { productId, variantId, quantity } = addToCartDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: variantId ? {
          where: { id: variantId },
          include: { inventory: true },
        } : false,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (!product.isActive) {
      throw new BadRequestException('Produto não está disponível');
    }

    if (variantId) {
      const variant = product.variants?.[0];
      if (!variant) {
        throw new NotFoundException('Variante não encontrada');
      }

      if (!variant.isActive) {
        throw new BadRequestException('Variante não está disponível');
      }

      // if (variant.inventory && (variant.inventory as any).available < quantity) {
      //   throw new BadRequestException('Quantidade indisponível em estoque');
      // }
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      const price = variantId ? product.variants?.[0]?.price || product.price : product.price;
      
      await this.prisma.cartItem.create({
        data: {
          cartId,
          productId,
          variantId: variantId || null,
          quantity,
          price,
        },
      });
    }

    return this.getCart(cartId, sessionId);
  }

  async updateItem(
    cartId: string,
    sessionId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    await this.validateCartAccess(cartId, sessionId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: updateCartItemDto.quantity },
    });

    return this.getCart(cartId, sessionId);
  }

  async removeItem(cartId: string, sessionId: string, itemId: string) {
    await this.validateCartAccess(cartId, sessionId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(cartId, sessionId);
  }

  async applyPromo(cartId: string, sessionId: string, applyPromoDto: ApplyPromoDto) {
    await this.validateCartAccess(cartId, sessionId);

    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code: applyPromoDto.code,
        isActive: true,
        startsAt: { lte: new Date() },
        expiresAt: { gte: new Date() },
      },
    });

    if (!coupon) {
      throw new BadRequestException('Código promocional inválido ou expirado');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let discountAmount = 0;

    if (coupon.type === 'PERCENTAGE') {
      discountAmount = Math.floor((subtotal * coupon.value) / 100);
    } else if (coupon.type === 'FIXED_AMOUNT') {
      discountAmount = coupon.value;
    }

    if (coupon.minAmount && subtotal < coupon.minAmount) {
      throw new BadRequestException(
        `Valor mínimo do carrinho deve ser R$ ${(coupon.minAmount / 100).toFixed(2)}`,
      );
    }

    await this.prisma.cart.update({
      where: { id: cartId },
      data: {
        // discountAmount,
      },
    });

    return this.getCart(cartId, sessionId);
  }

  async getCart(cartId: string, sessionId: string): Promise<CartResponseDto> {
    await this.validateCartAccess(cartId, sessionId);

    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
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
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                price: true,
                options: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    const cartWithItems = await this.prisma.cart.findUnique({
      where: { id: cartId },
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
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                price: true,
                options: true,
              },
            },
          },
        },
      },
    });

    if (!cartWithItems) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    const subtotal = cartWithItems.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const discountAmount = 0; // cart.discountAmount || 0;
    const total = Math.max(0, subtotal - discountAmount);

    return {
      id: cart.id,
      userId: cart.userId,
      sessionId: cart.sessionId,
      items: cartWithItems.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        product: item.product,
        variant: item.variant,
      })),
      totalItems: cartWithItems.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discountAmount,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  private async validateCartAccess(cartId: string, sessionId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    if (cart.sessionId !== sessionId) {
      throw new UnauthorizedException('Acesso negado ao carrinho');
    }

    if (cart.expiresAt && cart.expiresAt < new Date()) {
      throw new BadRequestException('Carrinho expirado');
    }
  }
}
