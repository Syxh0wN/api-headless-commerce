import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';
export declare class CheckoutService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
    getOrder(userId: string, orderId: string): Promise<OrderResponseDto>;
    listOrders(userId: string): Promise<OrderResponseDto[]>;
    updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto>;
}
