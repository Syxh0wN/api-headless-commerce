import { PrismaService } from '../../infra/prisma/prisma.service';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { WebhookResponseDto } from './dto/webhook-response.dto';
export declare class WebhookService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createWebhook(createWebhookDto: CreateWebhookDto): Promise<WebhookResponseDto>;
    getWebhooks(): Promise<WebhookResponseDto[]>;
    getWebhook(id: string): Promise<WebhookResponseDto>;
    updateWebhook(id: string, updateData: Partial<CreateWebhookDto>): Promise<WebhookResponseDto>;
    deleteWebhook(id: string): Promise<{
        message: string;
    }>;
    processWebhookEvent(webhookEventDto: WebhookEventDto): Promise<void>;
    deliverWebhook(webhookId: string, event: WebhookEventDto): Promise<void>;
    executeDelivery(deliveryId: string): Promise<void>;
    retryFailedDeliveries(): Promise<void>;
    getDeliveryStats(): Promise<{
        total: number;
        delivered: number;
        failed: number;
        pending: number;
    }>;
    private generateSignature;
    private mapWebhookToResponse;
}
