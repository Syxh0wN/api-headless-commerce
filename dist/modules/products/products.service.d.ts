import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        shortDescription: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        brandId: string | null;
    }>;
    findAll(query: ProductQueryDto): Promise<{
        products: ({
            variants: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                sku: string;
                attributes: import("@prisma/client/runtime/library").JsonValue;
                priceCents: number;
                currency: string;
                inventoryQty: number;
                version: number;
                isActive: boolean;
            }[];
            productCategories: ({
                category: {
                    id: string;
                    slug: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    sortOrder: number;
                    isActive: boolean;
                    image: string | null;
                    parentId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                productId: string;
                categoryId: string;
            })[];
        } & {
            id: string;
            title: string;
            slug: string;
            description: string | null;
            shortDescription: string | null;
            status: import(".prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            brandId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        shortDescription: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        brandId: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            priceCents: number;
            currency: string;
            inventoryQty: number;
            version: number;
            isActive: boolean;
        }[];
    } & {
        id: string;
        title: string;
        slug: string;
        description: string | null;
        shortDescription: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        brandId: string | null;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        shortDescription: string | null;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        brandId: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
