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
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            currency: string;
            isActive: boolean;
            sku: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            priceCents: number;
            inventoryQty: number;
            version: number;
        }[];
    } & {
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        slug: string;
        shortDescription: string | null;
        brandId: string | null;
    }>;
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<{
        variants: ({} & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            currency: string;
            isActive: boolean;
            sku: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            priceCents: number;
            inventoryQty: number;
            version: number;
        })[];
    } & {
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        slug: string;
        shortDescription: string | null;
        brandId: string | null;
    }>;
    removeProduct(id: string): Promise<void>;
    createVariant(productId: string, createVariantDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        currency: string;
        isActive: boolean;
        sku: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        priceCents: number;
        inventoryQty: number;
        version: number;
    }>;
    updateStock(variantId: string, stockDto: {
        quantity: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        currency: string;
        isActive: boolean;
        sku: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        priceCents: number;
        inventoryQty: number;
        version: number;
    }>;
    createPromoCode(createCouponDto: CreateCouponDto): Promise<{
        type: import(".prisma/client").$Enums.CouponType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isActive: boolean;
        value: number;
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
        code: string;
        isActive: boolean;
        value: number;
        startsAt: Date | null;
        endsAt: Date | null;
        maxRedemptions: number | null;
        usageCount: number;
    }>;
    removePromoCode(id: string): Promise<void>;
    listOrders(): Promise<({
        user: {
            email: string;
            name: string;
            id: string;
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
                    title: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                currency: string;
                isActive: boolean;
                sku: string;
                attributes: import("@prisma/client/runtime/library").JsonValue;
                priceCents: number;
                inventoryQty: number;
                version: number;
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
            createdAt: Date;
            updatedAt: Date;
            city: string;
            state: string;
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
            email: string;
            name: string;
            id: string;
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
                    title: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                currency: string;
                isActive: boolean;
                sku: string;
                attributes: import("@prisma/client/runtime/library").JsonValue;
                priceCents: number;
                inventoryQty: number;
                version: number;
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
            createdAt: Date;
            updatedAt: Date;
            city: string;
            state: string;
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
