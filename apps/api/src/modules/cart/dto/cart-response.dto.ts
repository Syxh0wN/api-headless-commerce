export class CartItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images?: any;
  };
}

export class CartResponseDto {
  id: string;
  userId: string;
  items: CartItemResponseDto[];
  totalItems: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
