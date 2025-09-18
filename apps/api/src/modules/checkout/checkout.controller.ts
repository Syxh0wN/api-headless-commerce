import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('checkout')
@ApiBearerAuth()
@Controller('checkout')
@UseGuards(AuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('orders')
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  async createOrder(@Request() req: any, @Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.checkoutService.createOrder(req.user.id, createOrderDto);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Obter pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido obtido com sucesso' })
  async getOrder(@Request() req: any, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.checkoutService.getOrder(req.user.id, id);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Listar pedidos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos obtida com sucesso' })
  async getUserOrders(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.checkoutService.getUserOrders(req.user.id, page, limit);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.checkoutService.updateOrderStatus(id, updateOrderStatusDto);
  }
}
