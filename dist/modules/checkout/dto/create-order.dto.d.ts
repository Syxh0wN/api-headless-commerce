export declare enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    PIX = "PIX",
    BOLETO = "BOLETO",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare class ShippingAddressDto {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
export declare class CreateOrderDto {
    cartId: string;
    couponCode?: string;
    paymentMethod: PaymentMethod;
    shippingAddress: ShippingAddressDto;
    notes?: string;
}
