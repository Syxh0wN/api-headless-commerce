import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GuestCartService } from './guest-cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';

@ApiTags('Cart v1')
@Controller('v1/carts')
export class CartController {
  constructor(private readonly guestCartService: GuestCartService) {}

  @Post()
  @ApiOperation({ summary: 'Criar carrinho para guest' })
  @ApiResponse({ status: 201, description: 'Carrinho criado com sucesso' })
  async createCart(@Res() res: Response) {
    const cart = await this.guestCartService.createCart();

    res.cookie('cart_session', cart.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    });

    return res.status(201).json({
      cartId: cart.id,
      sessionId: cart.sessionId,
    });
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiResponse({ status: 201, description: 'Item adicionado com sucesso' })
  async addItem(
    @Param('id') cartId: string,
    @Body() addToCartDto: AddToCartDto,
    @Req() req: Request,
  ) {
    const sessionId = req.cookies?.cart_session;
    return this.guestCartService.addItem(cartId, sessionId, addToCartDto);
  }

  @Patch(':id/items/:itemId')
  @ApiOperation({ summary: 'Atualizar quantidade do item' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
  async updateItem(
    @Param('id') cartId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req: Request,
  ) {
    const sessionId = req.cookies?.cart_session;
    return this.guestCartService.updateItem(
      cartId,
      sessionId,
      itemId,
      updateCartItemDto,
    );
  }

  @Delete(':id/items/:itemId')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  async removeItem(
    @Param('id') cartId: string,
    @Param('itemId') itemId: string,
    @Req() req: Request,
  ) {
    const sessionId = req.cookies?.cart_session;
    return this.guestCartService.removeItem(cartId, sessionId, itemId);
  }

  @Post(':id/apply-promo')
  @ApiOperation({ summary: 'Aplicar código promocional' })
  @ApiResponse({ status: 200, description: 'Código aplicado com sucesso' })
  async applyPromo(
    @Param('id') cartId: string,
    @Body() applyPromoDto: ApplyPromoDto,
    @Req() req: Request,
  ) {
    const sessionId = req.cookies?.cart_session;
    return this.guestCartService.applyPromo(cartId, sessionId, applyPromoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter carrinho com totais recalculados' })
  @ApiResponse({ status: 200, description: 'Carrinho obtido com sucesso' })
  async getCart(@Param('id') cartId: string, @Req() req: Request) {
    const sessionId = req.cookies?.cart_session;
    return this.guestCartService.getCart(cartId, sessionId);
  }
}
