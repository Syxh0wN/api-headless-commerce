import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ApiKeyService } from '../../common/auth/api-key.service';
import { AuditService } from '../../common/audit/audit.service';
export declare class AdminService {
    private prisma;
    private apiKeyService;
    private auditService;
    constructor(prisma: PrismaService, apiKeyService: ApiKeyService, auditService: AuditService);
    getAllProducts(query: any): Promise<{
        products: ({
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
        })[];
        pagination: {
            page: any;
            limit: any;
            total: number;
            totalPages: number;
        };
    }>;
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
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    removeProduct(id: string): Promise<void>;
    getProductVariants(productId: string): Promise<({} & {
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
    })[]>;
    createProductVariant(productId: string, variantData: any): Promise<{} & {
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
    updateInventory(variantId: string, inventoryData: any): Promise<{
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
    getCoupons(): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.CouponType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        value: number;
        code: string;
        minimumAmount: number | null;
        maximumDiscount: number | null;
        validUntil: Date | null;
        validFrom: Date | null;
        usageLimit: number | null;
        usedCount: number;
    }[]>;
    createCoupon(createCouponDto: CreateCouponDto): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.CouponType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        value: number;
        code: string;
        minimumAmount: number | null;
        maximumDiscount: number | null;
        validUntil: Date | null;
        validFrom: Date | null;
        usageLimit: number | null;
        usedCount: number;
    }>;
    updateCoupon(id: string, updateCouponDto: UpdateCouponDto): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.CouponType;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        value: number;
        code: string;
        minimumAmount: number | null;
        maximumDiscount: number | null;
        validUntil: Date | null;
        validFrom: Date | null;
        usageLimit: number | null;
        usedCount: number;
    }>;
    deleteCoupon(id: string): Promise<{
        message: string;
    }>;
    getAllOrders(query: any): Promise<{
        orders: ({
            user: {
                name: string;
                id: string;
                email: string;
            };
            items: ({
                variant: {
                    id: string;
                    sku: string;
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
        })[];
        pagination: {
            page: any;
            limit: any;
            total: number;
            totalPages: number;
        };
    }>;
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
    updateStock(variantId: string, quantity: number): Promise<{
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
    updateOrderStatus(id: string, status: string): Promise<{
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
    generateApiKey(role: string, expiresAt?: string): Promise<{
        key: string;
        role: string;
        expiresAt: Date;
        createdAt: Date;
    }>;
    listApiKeys(): Promise<any[]>;
    getAuditLogs(entity?: string, entityId?: string): Promise<any[]>;
}
