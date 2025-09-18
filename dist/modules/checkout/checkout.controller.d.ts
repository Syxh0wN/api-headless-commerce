import { AtomicCheckoutService } from './atomic-checkout.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
export declare class CheckoutController {
    private readonly atomicCheckoutService;
    constructor(atomicCheckoutService: AtomicCheckoutService);
    createOrder(req: any, createOrderDto: CreateOrderDto, idempotencyKey: string): Promise<OrderResponseDto>;
    getOrder(req: any, id: string): Promise<OrderResponseDto>;
    listOrders(req: any): Promise<OrderResponseDto[]>;
}
