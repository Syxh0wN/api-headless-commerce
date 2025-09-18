import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
  @ApiResponse({ status: 201, description: 'Produto adicionado ao carrinho' })
  async addToCart(@Request() req: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obter carrinho do usuário' })
  @ApiResponse({ status: 200, description: 'Carrinho obtido com sucesso' })
  async getCart(@Request() req: any): Promise<CartResponseDto> {
    return this.cartService.getCart(req.user.id);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Atualizar quantidade de item no carrinho' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
  async updateCartItem(
    @Request() req: any,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItem(req.user.id, itemId, updateCartItemDto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  async removeFromCart(
    @Request() req: any,
    @Param('itemId') itemId: string,
  ): Promise<CartResponseDto> {
    return this.cartService.removeFromCart(req.user.id, itemId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
  async clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
