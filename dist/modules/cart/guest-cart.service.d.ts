import { PrismaService } from '../../infra/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';
import { CartResponseDto } from './dto/cart-response.dto';
export declare class GuestCartService {
    private prisma;
    constructor(prisma: PrismaService);
    createCart(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CartStatus;
        currency: string;
        sessionId: string | null;
        userId: string | null;
    }>;
    addItem(cartId: string, sessionId: string, addToCartDto: AddToCartDto): Promise<{
        message: string;
    }>;
    updateItem(cartId: string, sessionId: string, itemId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        message: string;
    }>;
    removeItem(cartId: string, sessionId: string, itemId: string): Promise<{
        message: string;
    }>;
    applyPromo(cartId: string, sessionId: string, applyPromoDto: ApplyPromoDto): Promise<{
        message: string;
    }>;
    getCart(cartId: string, sessionId: string): Promise<CartResponseDto>;
}
