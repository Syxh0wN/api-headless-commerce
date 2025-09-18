import { WebhookEventType } from './webhook-event.dto';
export declare class CreateWebhookDto {
    name: string;
    url: string;
    events?: WebhookEventType[];
    isActive?: boolean;
    secret?: string;
}
