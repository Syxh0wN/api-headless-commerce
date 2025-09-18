import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailJobData } from './email.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>): Promise<void> {
    const { to, subject, template, data } = job.data;

    this.logger.log(`Processing email job ${job.id}: ${template} to ${to}`);

    try {
      switch (template) {
        case 'welcome':
          await this.sendWelcomeEmail(to, subject, data);
          break;
        case 'order-confirmation':
          await this.sendOrderConfirmationEmail(to, subject, data);
          break;
        case 'password-reset':
          await this.sendPasswordResetEmail(to, subject, data);
          break;
        case 'webhook-notification':
          await this.sendWebhookNotificationEmail(to, subject, data);
          break;
        default:
          this.logger.warn(`Unknown email template: ${template}`);
      }

      this.logger.log(`Email job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Email job ${job.id} failed:`, error);
      throw error;
    }
  }

  private async sendWelcomeEmail(to: string, subject: string, data: any): Promise<void> {
    this.logger.log(`Sending welcome email to ${to}`);
    
    const emailContent = `
      Olá ${data.name}!
      
      Bem-vindo ao Headless Commerce API!
      
      Sua conta foi criada com sucesso.
      
      Obrigado por escolher nossos serviços!
    `;

    await this.simulateEmailSending(to, subject, emailContent);
  }

  private async sendOrderConfirmationEmail(to: string, subject: string, data: any): Promise<void> {
    this.logger.log(`Sending order confirmation email to ${to}`);
    
    const emailContent = `
      Olá!
      
      Seu pedido #${data.orderNumber} foi confirmado!
      
      Total: R$ ${(data.total / 100).toFixed(2)}
      Status: ${data.status}
      
      Obrigado pela sua compra!
    `;

    await this.simulateEmailSending(to, subject, emailContent);
  }

  private async sendPasswordResetEmail(to: string, subject: string, data: any): Promise<void> {
    this.logger.log(`Sending password reset email to ${to}`);
    
    const emailContent = `
      Olá!
      
      Você solicitou a redefinição de sua senha.
      
      Token: ${data.resetToken}
      
      Use este token para redefinir sua senha.
    `;

    await this.simulateEmailSending(to, subject, emailContent);
  }

  private async sendWebhookNotificationEmail(to: string, subject: string, data: any): Promise<void> {
    this.logger.log(`Sending webhook notification email to ${to}`);
    
    const emailContent = `
      Olá!
      
      Uma notificação de webhook foi recebida:
      
      Evento: ${data.event}
      Status: ${data.status}
      
      Detalhes: ${JSON.stringify(data, null, 2)}
    `;

    await this.simulateEmailSending(to, subject, emailContent);
  }

  private async simulateEmailSending(to: string, subject: string, content: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.logger.log(`Email sent to ${to}: ${subject}`);
    this.logger.debug(`Email content: ${content}`);
  }
}
