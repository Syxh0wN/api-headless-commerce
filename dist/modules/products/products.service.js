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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto) {
        const product = await this.prisma.product.create({
            data: {
                title: createProductDto.title,
                slug: createProductDto.slug,
                description: createProductDto.description,
                status: createProductDto.isActive ? 'ACTIVE' : 'DRAFT',
            },
        });
        return product;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, category, sortBy = 'createdAt', sortOrder = 'desc', } = query;
        const skip = (page - 1) * limit;
        const where = {
            status: 'ACTIVE',
        };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.productCategories = {
                some: {
                    categoryId: category,
                },
            };
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    variants: true,
                    productCategories: {
                        include: {
                            category: true,
                        },
                    },
                },
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
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
        return product;
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                variants: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                title: updateProductDto.title,
                slug: updateProductDto.slug,
                description: updateProductDto.description,
                status: updateProductDto.isActive ? 'ACTIVE' : 'DRAFT',
            },
        });
        return updatedProduct;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Produto removido com sucesso' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map