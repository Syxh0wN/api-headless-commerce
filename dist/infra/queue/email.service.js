"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let EmailService = EmailService_1 = class EmailService {
    constructor(emailQueue) {
        this.emailQueue = emailQueue;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async sendWelcomeEmail(to, name) {
        await this.emailQueue.add('welcome', {
            to,
            subject: 'Bem-vindo ao Headless Commerce!',
            template: 'welcome',
            data: { name },
        });
        this.logger.log(`Welcome email queued for ${to}`);
    }
    async sendOrderConfirmationEmail(to, orderData) {
        await this.emailQueue.add('order-confirmation', {
            to,
            subject: `Confirmação do Pedido #${orderData.orderNumber}`,
            template: 'order-confirmation',
            data: orderData,
        });
        this.logger.log(`Order confirmation email queued for ${to}`);
    }
    async sendPasswordResetEmail(to, resetToken) {
        await this.emailQueue.add('password-reset', {
            to,
            subject: 'Redefinição de Senha',
            template: 'password-reset',
            data: { resetToken },
        });
        this.logger.log(`Password reset email queued for ${to}`);
    }
    async sendWebhookNotificationEmail(to, webhookData) {
        await this.emailQueue.add('webhook-notification', {
            to,
            subject: 'Notificação de Webhook',
            template: 'webhook-notification',
            data: webhookData,
        });
        this.logger.log(`Webhook notification email queued for ${to}`);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('email')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], EmailService);
//# sourceMappingURL=email.service.js.map