export declare enum WebhookEventType {
    ORDER_CREATED = "ORDER_CREATED",
    ORDER_UPDATED = "ORDER_UPDATED",
    ORDER_CANCELLED = "ORDER_CANCELLED",
    PAYMENT_PROCESSED = "PAYMENT_PROCESSED",
    PAYMENT_FAILED = "PAYMENT_FAILED",
    PAYMENT_REFUNDED = "PAYMENT_REFUNDED",
    SHIPMENT_CREATED = "SHIPMENT_CREATED",
    SHIPMENT_DELIVERED = "SHIPMENT_DELIVERED"
}
export declare enum WebhookSource {
    INTERNAL = "INTERNAL",
    STRIPE = "STRIPE",
    PAGSEGURO = "PAGSEGURO",
    MERCADOPAGO = "MERCADOPAGO",
    CORREIOS = "CORREIOS"
}
export declare class WebhookEventDto {
    eventType: WebhookEventType;
    source: WebhookSource;
    entityId: string;
    data: Record<string, any>;
    signature?: string;
    timestamp?: number;
}
