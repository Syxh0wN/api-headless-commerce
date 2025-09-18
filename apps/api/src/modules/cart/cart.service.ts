import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItem(userId: string, addToCartDto: AddToCartDto) {
    return { message: 'Item adicionado ao carrinho' };
  }

  async removeItem(userId: string, itemId: string) {
    return { message: 'Item removido do carrinho' };
  }

  async updateItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    return { message: 'Item atualizado no carrinho' };
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    return {
      id: 'temp-cart-id',
      userId,
      items: [],
      totalItems: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
