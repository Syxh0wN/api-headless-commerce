export class CartItemResponseDto {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images?: any;
  };
  variant?: {
    id: string;
    name: string;
    price: number;
    options?: any;
  };
}

export class CartResponseDto {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItemResponseDto[];
  totalItems: number;
  subtotal?: number;
  discountAmount?: number;
  total: number;
  coupon?: {
    id: string;
    code: string;
    type: string;
    value: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
