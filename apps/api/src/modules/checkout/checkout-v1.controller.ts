import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IdempotencyInterceptor } from '../../common/interceptors/idempotency.interceptor';
import { AtomicCheckoutService } from './atomic-checkout.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('Checkout v1')
@ApiBearerAuth()
@Controller('v1/checkout')
@UseGuards(AuthGuard)
export class CheckoutV1Controller {
  constructor(private readonly atomicCheckoutService: AtomicCheckoutService) {}

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  @ApiOperation({ summary: 'Processar checkout com idempotência' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Conflito de estoque' })
  @ApiHeader({ 
    name: 'Idempotency-Key', 
    description: 'Chave de idempotência para evitar duplicação',
    required: true 
  })
  async createOrder(
    @Request() req: any,
    @Body() createOrderDto: CreateOrderDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<OrderResponseDto> {
    if (!idempotencyKey) {
      throw new Error('Header Idempotency-Key é obrigatório');
    }

    return this.atomicCheckoutService.processCheckout(
      req.user.id,
      createOrderDto.cartId,
      createOrderDto,
      idempotencyKey,
    );
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Obter pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido obtido com sucesso' })
  async getOrder(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<OrderResponseDto> {
    // Implementar busca de pedido
    throw new Error('Implementar busca de pedido');
  }

  @Get('orders')
  @ApiOperation({ summary: 'Listar pedidos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  async listOrders(@Request() req: any): Promise<OrderResponseDto[]> {
    // Implementar listagem de pedidos
    throw new Error('Implementar listagem de pedidos');
  }
}
