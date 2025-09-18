import { Queue } from 'bullmq';
export interface EmailJobData {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}
export declare class EmailService {
    private emailQueue;
    private readonly logger;
    constructor(emailQueue: Queue<EmailJobData>);
    sendWelcomeEmail(to: string, name: string): Promise<void>;
    sendOrderConfirmationEmail(to: string, orderData: any): Promise<void>;
    sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;
    sendWebhookNotificationEmail(to: string, webhookData: any): Promise<void>;
}
