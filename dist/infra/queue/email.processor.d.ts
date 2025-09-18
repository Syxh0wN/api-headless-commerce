import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailJobData } from './email.service';
export declare class EmailProcessor extends WorkerHost {
    private readonly logger;
    process(job: Job<EmailJobData>): Promise<void>;
    private sendWelcomeEmail;
    private sendOrderConfirmationEmail;
    private sendPasswordResetEmail;
    private sendWebhookNotificationEmail;
    private simulateEmailSending;
}
