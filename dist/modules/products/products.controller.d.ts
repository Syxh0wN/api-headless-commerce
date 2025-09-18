import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
                    sortOrder: number;
                    name: string;
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
            brandId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
