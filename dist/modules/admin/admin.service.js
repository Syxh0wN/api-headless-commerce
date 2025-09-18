"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const api_key_service_1 = require("../../common/auth/api-key.service");
const audit_service_1 = require("../../common/audit/audit.service");
let AdminService = class AdminService {
    constructor(prisma, apiKeyService, auditService) {
        this.prisma = prisma;
        this.apiKeyService = apiKeyService;
        this.auditService = auditService;
    }
    async getAllProducts(query) {
        const { page = 1, limit = 20, search, category, status } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.categoryId = category;
        }
        if (status !== undefined) {
            where.isActive = status === 'active';
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    variants: {
                        include: {},
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createProduct(createProductDto) {
        const product = await this.prisma.product.create({
            data: createProductDto,
            include: {
                variants: true,
            },
        });
        return product;
    }
    async updateProduct(id, updateProductDto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                variants: {
                    include: {},
                },
            },
        });
        return updatedProduct;
    }
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Produto deletado com sucesso' };
    }
    async removeProduct(id) {
        await this.prisma.product.delete({ where: { id } });
    }
    async getProductVariants(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
        const variants = await this.prisma.productVariant.findMany({
            where: { productId },
            include: {},
            orderBy: { createdAt: 'desc' },
        });
        return variants;
    }
    async createProductVariant(productId, variantData) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
        const variant = await this.prisma.productVariant.create({
            data: {
                ...variantData,
                productId,
            },
            include: {},
        });
        return variant;
    }
    async updateInventory(variantId, inventoryData) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!variant) {
            throw new common_1.NotFoundException('Variante não encontrada');
        }
        const inventory = await this.prisma.productVariant.update({
            where: { id: variantId },
            data: {
                inventoryQty: inventoryData.quantity,
            },
        });
        return inventory;
    }
    async getCoupons() {
        const coupons = await this.prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return coupons;
    }
    async createCoupon(createCouponDto) {
        const existingCoupon = await this.prisma.coupon.findUnique({
            where: { code: createCouponDto.code },
        });
        if (existingCoupon) {
            throw new common_1.BadRequestException('Código de cupom já existe');
        }
        const coupon = await this.prisma.coupon.create({
            data: {
                ...createCouponDto,
                name: createCouponDto.description || createCouponDto.code,
            },
        });
        return coupon;
    }
    async updateCoupon(id, updateCouponDto) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Cupom não encontrado');
        }
        if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
            const existingCoupon = await this.prisma.coupon.findUnique({
                where: { code: updateCouponDto.code },
            });
            if (existingCoupon) {
                throw new common_1.BadRequestException('Código de cupom já existe');
            }
        }
        const updatedCoupon = await this.prisma.coupon.update({
            where: { id },
            data: updateCouponDto,
        });
        return updatedCoupon;
    }
    async deleteCoupon(id) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Cupom não encontrado');
        }
        await this.prisma.coupon.delete({
            where: { id },
        });
        return { message: 'Cupom deletado com sucesso' };
    }
    async getAllOrders(query) {
        const { page = 1, limit = 20, status, startDate, endDate } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    items: {
                        include: {
                            variant: {
                                select: {
                                    id: true,
                                    sku: true,
                                },
                            },
                        },
                    },
                    shipping: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createVariant(productId, createVariantDto) {
        const variant = await this.prisma.productVariant.create({
            data: {
                productId,
                sku: createVariantDto.sku,
                attributes: createVariantDto.attributes || {},
                priceCents: createVariantDto.priceCents,
                inventoryQty: createVariantDto.inventoryQty || 0,
                isActive: createVariantDto.isActive !== false,
            },
        });
        return variant;
    }
    async updateStock(variantId, quantity) {
        const variant = await this.prisma.productVariant.update({
            where: { id: variantId },
            data: { inventoryQty: quantity },
        });
        return variant;
    }
    async createPromoCode(createCouponDto) {
        const promoCode = await this.prisma.promoCode.create({
            data: {
                code: createCouponDto.code,
                type: createCouponDto.type,
                value: createCouponDto.value,
                startsAt: createCouponDto.validFrom,
                endsAt: createCouponDto.validUntil,
                maxRedemptions: createCouponDto.usageLimit,
                isActive: createCouponDto.isActive !== false,
            },
        });
        return promoCode;
    }
    async updatePromoCode(id, updateCouponDto) {
        const promoCode = await this.prisma.promoCode.update({
            where: { id },
            data: {
                code: updateCouponDto.code,
                type: updateCouponDto.type,
                value: updateCouponDto.value,
                startsAt: updateCouponDto.validFrom,
                endsAt: updateCouponDto.validUntil,
                maxRedemptions: updateCouponDto.usageLimit,
                isActive: updateCouponDto.isActive,
            },
        });
        return promoCode;
    }
    async removePromoCode(id) {
        await this.prisma.promoCode.delete({ where: { id } });
    }
    async listOrders() {
        return this.prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        title: true,
                                    },
                                },
                            },
                        },
                    },
                },
                shipping: true,
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateOrderStatus(id, status) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status: status },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        title: true,
                                    },
                                },
                            },
                        },
                    },
                },
                shipping: true,
                payment: true,
            },
        });
        return order;
    }
    async generateApiKey(role, expiresAt) {
        const expiresAtDate = expiresAt ? new Date(expiresAt) : undefined;
        const { key, hash } = await this.apiKeyService.generateApiKey(role, expiresAtDate);
        return {
            key,
            role,
            expiresAt: expiresAtDate,
            createdAt: new Date(),
        };
    }
    async listApiKeys() {
        return this.apiKeyService.listApiKeys();
    }
    async getAuditLogs(entity, entityId) {
        return this.auditService.getAuditLogs(entity, entityId);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        api_key_service_1.ApiKeyService,
        audit_service_1.AuditService])
], AdminService);
//# sourceMappingURL=admin.service.js.map