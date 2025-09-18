export class OrderItemResponseDto {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images?: any;
  };
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItemResponseDto[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
