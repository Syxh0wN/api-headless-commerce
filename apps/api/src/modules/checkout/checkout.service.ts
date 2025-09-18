import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return {
      id: 'temp-order-id',
      orderNumber: `ORD-${Date.now()}`,
      userId,
      status: 'PENDING',
      subtotal: 0,
      shippingCost: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0,
      paymentMethod: createOrderDto.paymentMethod,
      paymentStatus: 'PENDING',
      shippingAddress: createOrderDto.shippingAddress,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getOrder(userId: string, orderId: string): Promise<OrderResponseDto> {
    return {
      id: orderId,
      orderNumber: `ORD-${Date.now()}`,
      userId,
      status: 'PENDING',
      subtotal: 0,
      shippingCost: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'PENDING',
      shippingAddress: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async listOrders(userId: string): Promise<OrderResponseDto[]> {
    return [];
  }

  async updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    return {
      id: orderId,
      orderNumber: `ORD-${Date.now()}`,
      userId: 'temp-user',
      status: updateOrderStatusDto.status,
      subtotal: 0,
      shippingCost: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'PENDING',
      shippingAddress: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
