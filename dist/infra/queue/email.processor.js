"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let EmailProcessor = EmailProcessor_1 = class EmailProcessor extends bullmq_1.WorkerHost {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(EmailProcessor_1.name);
    }
    async process(job) {
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
        }
        catch (error) {
            this.logger.error(`Email job ${job.id} failed:`, error);
            throw error;
        }
    }
    async sendWelcomeEmail(to, subject, data) {
        this.logger.log(`Sending welcome email to ${to}`);
        const emailContent = `
      Olá ${data.name}!
      
      Bem-vindo ao Headless Commerce API!
      
      Sua conta foi criada com sucesso.
      
      Obrigado por escolher nossos serviços!
    `;
        await this.simulateEmailSending(to, subject, emailContent);
    }
    async sendOrderConfirmationEmail(to, subject, data) {
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
    async sendPasswordResetEmail(to, subject, data) {
        this.logger.log(`Sending password reset email to ${to}`);
        const emailContent = `
      Olá!
      
      Você solicitou a redefinição de sua senha.
      
      Token: ${data.resetToken}
      
      Use este token para redefinir sua senha.
    `;
        await this.simulateEmailSending(to, subject, emailContent);
    }
    async sendWebhookNotificationEmail(to, subject, data) {
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
    async simulateEmailSending(to, subject, content) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.logger.log(`Email sent to ${to}: ${subject}`);
        this.logger.debug(`Email content: ${content}`);
    }
};
exports.EmailProcessor = EmailProcessor;
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('email')
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map