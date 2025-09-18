import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectQueue('email') private emailQueue: Queue<EmailJobData>,
  ) {}

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.emailQueue.add('welcome', {
      to,
      subject: 'Bem-vindo ao Headless Commerce!',
      template: 'welcome',
      data: { name },
    });
    this.logger.log(`Welcome email queued for ${to}`);
  }

  async sendOrderConfirmationEmail(to: string, orderData: any): Promise<void> {
    await this.emailQueue.add('order-confirmation', {
      to,
      subject: `Confirmação do Pedido #${orderData.orderNumber}`,
      template: 'order-confirmation',
      data: orderData,
    });
    this.logger.log(`Order confirmation email queued for ${to}`);
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    await this.emailQueue.add('password-reset', {
      to,
      subject: 'Redefinição de Senha',
      template: 'password-reset',
      data: { resetToken },
    });
    this.logger.log(`Password reset email queued for ${to}`);
  }

  async sendWebhookNotificationEmail(to: string, webhookData: any): Promise<void> {
    await this.emailQueue.add('webhook-notification', {
      to,
      subject: 'Notificação de Webhook',
      template: 'webhook-notification',
      data: webhookData,
    });
    this.logger.log(`Webhook notification email queued for ${to}`);
  }
}
