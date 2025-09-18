export declare class CreateProductDto {
    title: string;
    slug: string;
    sku: string;
    description?: string;
    price: number;
    categoryId: string;
    tags?: string[];
    isActive?: boolean;
}
