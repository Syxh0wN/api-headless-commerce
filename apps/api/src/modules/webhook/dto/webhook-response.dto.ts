export class WebhookDeliveryResponseDto {
  id: string;
  webhookId: string;
  url: string;
  status: string;
  statusCode?: number;
  responseBody?: string;
  attempts: number;
  lastAttemptAt?: Date;
  nextRetryAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class WebhookResponseDto {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  deliveries: WebhookDeliveryResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
