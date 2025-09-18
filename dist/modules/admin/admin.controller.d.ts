import { AdminService } from './admin.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createProduct(createProductDto: CreateProductDto): Promise<{
        variants: {
            id: string;
            version: number;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            isActive: boolean;
            productId: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            priceCents: number;
            currency: string;
            inventoryQty: number;
        }[];
    } & {
        description: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        shortDescription: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        brandId: string | null;
    }>;
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<{
        variants: ({} & {
            id: string;
            version: number;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            isActive: boolean;
            productId: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            priceCents: number;
            currency: string;
            inventoryQty: number;
        })[];
    } & {
        description: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        shortDescription: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        brandId: string | null;
    }>;
    removeProduct(id: string): Promise<void>;
    createVariant(productId: string, createVariantDto: any): Promise<{
        id: string;
        version: number;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        isActive: boolean;
        productId: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        priceCents: number;
        currency: string;
        inventoryQty: number;
    }>;
    updateStock(variantId: string, stockDto: {
        quantity: number;
    }): Promise<{
        id: string;
        version: number;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        isActive: boolean;
        productId: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        priceCents: number;
        currency: string;
        inventoryQty: number;
    }>;
    createPromoCode(createCouponDto: CreateCouponDto): Promise<{
        type: import(".prisma/client").$Enums.CouponType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        value: number;
        code: string;
        startsAt: Date | null;
        endsAt: Date | null;
        maxRedemptions: number | null;
        usageCount: number;
    }>;
    updatePromoCode(id: string, updateCouponDto: UpdateCouponDto): Promise<{
        type: import(".prisma/client").$Enums.CouponType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        value: number;
        code: string;
        startsAt: Date | null;
        endsAt: Date | null;
        maxRedemptions: number | null;
        usageCount: number;
    }>;
    removePromoCode(id: string): Promise<void>;
    listOrders(): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            currency: string;
            orderId: string;
            provider: string;
            providerRef: string | null;
            amountCents: number;
            idempotencyKey: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
        items: ({
            variant: {
                product: {
                    id: string;
                    title: string;
                };
            } & {
                id: string;
                version: number;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                isActive: boolean;
                productId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue;
                priceCents: number;
                currency: string;
                inventoryQty: number;
            };
        } & {
            id: string;
            createdAt: Date;
            variantId: string;
            orderId: string;
            qty: number;
            unitPriceCents: number;
        })[];
        shipping: {
            id: string;
            state: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            zipCode: string;
            country: string;
            orderId: string;
            firstName: string;
            lastName: string;
            company: string | null;
            address1: string;
            address2: string | null;
            phone: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        currency: string;
        userId: string;
        cartId: string | null;
        orderNumber: string;
        amountSubtotalCents: number;
        amountTotalCents: number;
        placedAt: Date | null;
    })[]>;
    updateOrderStatus(id: string, statusDto: {
        status: string;
    }): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            currency: string;
            orderId: string;
            provider: string;
            providerRef: string | null;
            amountCents: number;
            idempotencyKey: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
        items: ({
            variant: {
                product: {
                    id: string;
                    title: string;
                };
            } & {
                id: string;
                version: number;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                isActive: boolean;
                productId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue;
                priceCents: number;
                currency: string;
                inventoryQty: number;
            };
        } & {
            id: string;
            createdAt: Date;
            variantId: string;
            orderId: string;
            qty: number;
            unitPriceCents: number;
        })[];
        shipping: {
            id: string;
            state: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            zipCode: string;
            country: string;
            orderId: string;
            firstName: string;
            lastName: string;
            company: string | null;
            address1: string;
            address2: string | null;
            phone: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        currency: string;
        userId: string;
        cartId: string | null;
        orderNumber: string;
        amountSubtotalCents: number;
        amountTotalCents: number;
        placedAt: Date | null;
    }>;
    generateApiKey(keyDto: {
        role: string;
        expiresAt?: string;
    }): Promise<{
        key: string;
        role: string;
        expiresAt: Date;
        createdAt: Date;
    }>;
    listApiKeys(): Promise<any[]>;
    getAuditLogs(entity?: string, entityId?: string): Promise<any[]>;
}
