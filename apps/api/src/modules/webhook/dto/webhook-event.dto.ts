import { IsString, IsEnum, IsObject, IsOptional, IsNumber } from 'class-validator';

export enum WebhookEventType {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',
  SHIPMENT_CREATED = 'SHIPMENT_CREATED',
  SHIPMENT_DELIVERED = 'SHIPMENT_DELIVERED',
}

export enum WebhookSource {
  INTERNAL = 'INTERNAL',
  STRIPE = 'STRIPE',
  PAGSEGURO = 'PAGSEGURO',
  MERCADOPAGO = 'MERCADOPAGO',
  CORREIOS = 'CORREIOS',
}

export class WebhookEventDto {
  @IsEnum(WebhookEventType)
  eventType: WebhookEventType;

  @IsEnum(WebhookSource)
  source: WebhookSource;

  @IsString()
  entityId: string;

  @IsObject()
  data: Record<string, any>;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsNumber()
  @IsOptional()
  timestamp?: number;
}
