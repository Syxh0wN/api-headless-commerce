"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEventService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let WebhookEventService = class WebhookEventService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processWebhookEvent(provider, eventData) {
        const existingEvent = await this.prisma.webhookEvent.findUnique({
            where: { externalId: eventData.externalId },
        });
        if (existingEvent) {
            if (existingEvent.processedAt) {
                return { processed: true, eventId: existingEvent.id };
            }
            else {
                throw new common_1.ConflictException('Evento já existe mas não foi processado');
            }
        }
        const isValidSignature = this.validateSignature(eventData.signature, eventData.payload, provider);
        if (!isValidSignature) {
            throw new common_1.BadRequestException('Assinatura HMAC inválida');
        }
        const event = await this.prisma.webhookEvent.create({
            data: {
                externalId: eventData.externalId,
                signature: eventData.signature,
                payload: eventData.payload,
            },
        });
        try {
            await this.processEventByProvider(provider, eventData.payload);
            await this.prisma.webhookEvent.update({
                where: { id: event.id },
                data: { processedAt: new Date() },
            });
            return { processed: true, eventId: event.id };
        }
        catch (error) {
            console.error(`Erro ao processar webhook ${provider}:`, error);
            throw error;
        }
    }
    validateSignature(signature, payload, provider) {
        const secret = this.getProviderSecret(provider);
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    }
    getProviderSecret(provider) {
        const secrets = {
            stripe: process.env.STRIPE_WEBHOOK_SECRET || 'stripe_secret',
            pagseguro: process.env.PAGSEGURO_WEBHOOK_SECRET || 'pagseguro_secret',
            mock: 'mock_secret',
        };
        return secrets[provider] || 'default_secret';
    }
    async processEventByProvider(provider, payload) {
        switch (provider) {
            case 'stripe':
                await this.processStripeEvent(payload);
                break;
            case 'pagseguro':
                await this.processPagSeguroEvent(payload);
                break;
            case 'mock':
                await this.processMockEvent(payload);
                break;
            default:
                throw new common_1.BadRequestException(`Provider ${provider} não suportado`);
        }
    }
    async processStripeEvent(payload) {
        console.log('Processando evento Stripe:', payload.type);
        switch (payload.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSuccess(payload.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailure(payload.data.object);
                break;
            default:
                console.log(`Evento Stripe não tratado: ${payload.type}`);
        }
    }
    async processPagSeguroEvent(payload) {
        console.log('Processando evento PagSeguro:', payload.eventType);
    }
    async processMockEvent(payload) {
        console.log('Processando evento Mock:', payload);
    }
    async handlePaymentSuccess(paymentIntent) {
        const payment = await this.prisma.payment.findFirst({
            where: { providerRef: paymentIntent.id },
        });
        if (payment) {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'COMPLETED' },
            });
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'CONFIRMED' },
            });
        }
    }
    async handlePaymentFailure(paymentIntent) {
        const payment = await this.prisma.payment.findFirst({
            where: { providerRef: paymentIntent.id },
        });
        if (payment) {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED' },
            });
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'CANCELLED' },
            });
        }
    }
    async getWebhookEvents(limit = 100, offset = 0) {
        return this.prisma.webhookEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    async getWebhookEventById(id) {
        return this.prisma.webhookEvent.findUnique({
            where: { id },
        });
    }
};
exports.WebhookEventService = WebhookEventService;
exports.WebhookEventService = WebhookEventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhookEventService);
//# sourceMappingURL=webhook-event.service.js.map