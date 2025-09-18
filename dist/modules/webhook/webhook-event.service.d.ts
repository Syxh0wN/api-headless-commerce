import { PrismaService } from '../../infra/prisma/prisma.service';
export interface WebhookEventData {
    externalId: string;
    signature: string;
    payload: any;
    provider: string;
}
export declare class WebhookEventService {
    private prisma;
    constructor(prisma: PrismaService);
    processWebhookEvent(provider: string, eventData: WebhookEventData): Promise<{
        processed: boolean;
        eventId?: string;
    }>;
    private validateSignature;
    private getProviderSecret;
    private processEventByProvider;
    private processStripeEvent;
    private processPagSeguroEvent;
    private processMockEvent;
    private handlePaymentSuccess;
    private handlePaymentFailure;
    getWebhookEvents(limit?: number, offset?: number): Promise<any[]>;
    getWebhookEventById(id: string): Promise<any>;
}
