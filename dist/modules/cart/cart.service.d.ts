import { PrismaService } from '../../infra/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    addItem(userId: string, addToCartDto: AddToCartDto): Promise<{
        message: string;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        message: string;
    }>;
    updateItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        message: string;
    }>;
    getCart(userId: string): Promise<CartResponseDto>;
}
