import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@Injectable()
export class GuestCartService {
  constructor(private prisma: PrismaService) {}

  async createCart() {
    const cart = await this.prisma.cart.create({
      data: {
        sessionId: `session_${Date.now()}`,
        status: 'OPEN',
        currency: 'BRL',
      },
    });
    return cart;
  }

  async addItem(cartId: string, sessionId: string, addToCartDto: AddToCartDto) {
    return { message: 'Item adicionado ao carrinho' };
  }

  async updateItem(cartId: string, sessionId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    return { message: 'Item atualizado no carrinho' };
  }

  async removeItem(cartId: string, sessionId: string, itemId: string) {
    return { message: 'Item removido do carrinho' };
  }

  async applyPromo(cartId: string, sessionId: string, applyPromoDto: ApplyPromoDto) {
    return { message: 'Código promocional aplicado' };
  }

  async getCart(cartId: string, sessionId: string): Promise<CartResponseDto> {
    return {
      id: cartId,
      sessionId,
      items: [],
      totalItems: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
