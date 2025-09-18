import { WebhookEventService } from './webhook-event.service';
export declare class WebhookController {
    private readonly webhookEventService;
    constructor(webhookEventService: WebhookEventService);
    processWebhook(provider: string, payload: any, signature: string, externalId: string): Promise<{
        success: boolean;
        processed: boolean;
        eventId: string;
        message: string;
    }>;
    testWebhook(provider: string, payload: any): Promise<{
        success: boolean;
        processed: boolean;
        eventId: string;
        message: string;
    }>;
}
