import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
export declare class AtomicCheckoutService {
    private prisma;
    constructor(prisma: PrismaService);
    processCheckout(userId: string, cartId: string, createOrderDto: CreateOrderDto, idempotencyKey: string): Promise<OrderResponseDto>;
}
