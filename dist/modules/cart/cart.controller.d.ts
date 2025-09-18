import { Request, Response } from 'express';
import { GuestCartService } from './guest-cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';
export declare class CartController {
    private readonly guestCartService;
    constructor(guestCartService: GuestCartService);
    createCart(res: Response): Promise<Response<any, Record<string, any>>>;
    addItem(cartId: string, addToCartDto: AddToCartDto, req: Request): Promise<{
        message: string;
    }>;
    updateItem(cartId: string, itemId: string, updateCartItemDto: UpdateCartItemDto, req: Request): Promise<{
        message: string;
    }>;
    removeItem(cartId: string, itemId: string, req: Request): Promise<{
        message: string;
    }>;
    applyPromo(cartId: string, applyPromoDto: ApplyPromoDto, req: Request): Promise<{
        message: string;
    }>;
    getCart(cartId: string, req: Request): Promise<import("./dto/cart-response.dto").CartResponseDto>;
}
