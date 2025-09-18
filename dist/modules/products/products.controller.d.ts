import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: ProductQueryDto): Promise<{
        products: ({
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
            productCategories: ({
                category: {
                    description: string | null;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    isActive: boolean;
                    sortOrder: number;
                    image: string | null;
                    parentId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                categoryId: string;
                productId: string;
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
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
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
}
