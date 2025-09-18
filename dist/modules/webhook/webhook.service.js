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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const webhook_event_dto_1 = require("./dto/webhook-event.dto");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    async createWebhook(createWebhookDto) {
        const webhook = await this.prisma.webhook.create({
            data: {
                url: createWebhookDto.url,
                events: createWebhookDto.events || Object.values(webhook_event_dto_1.WebhookEventType),
                isActive: createWebhookDto.isActive ?? true,
                secret: createWebhookDto.secret || '',
            },
            include: {
                deliveries: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        return this.mapWebhookToResponse(webhook);
    }
    async getWebhooks() {
        const webhooks = await this.prisma.webhook.findMany({
            include: {
                deliveries: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return webhooks.map((webhook) => this.mapWebhookToResponse(webhook));
    }
    async getWebhook(id) {
        const webhook = await this.prisma.webhook.findUnique({
            where: { id },
            include: {
                deliveries: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!webhook) {
            throw new common_1.BadRequestException('Webhook não encontrado');
        }
        return this.mapWebhookToResponse(webhook);
    }
    async updateWebhook(id, updateData) {
        const webhook = await this.prisma.webhook.update({
            where: { id },
            data: updateData,
            include: {
                deliveries: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        return this.mapWebhookToResponse(webhook);
    }
    async deleteWebhook(id) {
        await this.prisma.webhook.delete({
            where: { id },
        });
        return { message: 'Webhook removido com sucesso' };
    }
    async processWebhookEvent(webhookEventDto) {
        this.logger.log(`Processando evento: ${webhookEventDto.eventType}`);
        const webhooks = await this.prisma.webhook.findMany({
            where: {
                isActive: true,
                events: {
                    has: webhookEventDto.eventType,
                },
            },
        });
        for (const webhook of webhooks) {
            await this.deliverWebhook(webhook.id, webhookEventDto);
        }
    }
    async deliverWebhook(webhookId, event) {
        const webhook = await this.prisma.webhook.findUnique({
            where: { id: webhookId },
        });
        if (!webhook || !webhook.isActive) {
            return;
        }
        const delivery = await this.prisma.webhookDelivery.create({
            data: {
                webhookId,
                event: event.eventType,
                payload: event,
                status: client_1.DeliveryStatus.PENDING,
                attempts: 0,
            },
        });
        await this.executeDelivery(delivery.id);
    }
    async executeDelivery(deliveryId) {
        const delivery = await this.prisma.webhookDelivery.findUnique({
            where: { id: deliveryId },
            include: { webhook: true },
        });
        if (!delivery) {
            return;
        }
        const maxAttempts = 5;
        const baseDelay = 1000;
        if (delivery.attempts >= maxAttempts) {
            await this.prisma.webhookDelivery.update({
                where: { id: deliveryId },
                data: {
                    status: client_1.DeliveryStatus.FAILED,
                },
            });
            return;
        }
        try {
            const response = await fetch(delivery.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': this.generateSignature(JSON.stringify(delivery.payload), delivery.webhook.secret),
                    'X-Webhook-Event': delivery.event,
                },
                body: JSON.stringify(delivery.payload),
            });
            if (response.ok) {
                await this.prisma.webhookDelivery.update({
                    where: { id: deliveryId },
                    data: {
                        status: client_1.DeliveryStatus.DELIVERED,
                        response: await response
                            .json()
                            .catch(() => ({ status: response.status })),
                        attempts: delivery.attempts + 1,
                        deliveredAt: new Date(),
                    },
                });
            }
            else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
        catch (error) {
            const nextRetryAt = new Date(Date.now() + baseDelay * Math.pow(2, delivery.attempts));
            await this.prisma.webhookDelivery.update({
                where: { id: deliveryId },
                data: {
                    status: client_1.DeliveryStatus.FAILED,
                    response: { error: error.message, status: error.status || 0 },
                    attempts: delivery.attempts + 1,
                    nextRetryAt,
                },
            });
            setTimeout(() => {
                void this.executeDelivery(deliveryId);
            }, baseDelay * Math.pow(2, delivery.attempts));
        }
    }
    async retryFailedDeliveries() {
        const failedDeliveries = await this.prisma.webhookDelivery.findMany({
            where: {
                status: client_1.DeliveryStatus.FAILED,
                attempts: { lt: 5 },
                nextRetryAt: { lte: new Date() },
            },
            include: { webhook: true },
        });
        for (const delivery of failedDeliveries) {
            if (delivery.webhook.isActive) {
                await this.executeDelivery(delivery.id);
            }
        }
    }
    async getDeliveryStats() {
        const stats = await this.prisma.webhookDelivery.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        const result = {
            total: 0,
            delivered: 0,
            failed: 0,
            pending: 0,
        };
        for (const stat of stats) {
            result.total += stat._count.status;
            switch (stat.status) {
                case client_1.DeliveryStatus.DELIVERED:
                    result.delivered = stat._count.status;
                    break;
                case client_1.DeliveryStatus.FAILED:
                    result.failed = stat._count.status;
                    break;
                case client_1.DeliveryStatus.PENDING:
                    result.pending = stat._count.status;
                    break;
            }
        }
        return result;
    }
    generateSignature(payload, secret) {
        if (!secret) {
            return '';
        }
        return crypto.createHmac('sha256', secret).update(payload).digest('hex');
    }
    mapWebhookToResponse(webhook) {
        return {
            id: webhook.id,
            name: webhook.url,
            url: webhook.url,
            events: webhook.events,
            isActive: webhook.isActive,
            secret: webhook.secret ? '***' : undefined,
            deliveries: webhook.deliveries.map((delivery) => ({
                id: delivery.id,
                webhookId: delivery.webhookId,
                url: webhook.url,
                status: delivery.status,
                statusCode: delivery.response?.status,
                responseBody: delivery.response
                    ? JSON.stringify(delivery.response)
                    : undefined,
                attempts: delivery.attempts,
                lastAttemptAt: delivery.deliveredAt,
                nextRetryAt: delivery.nextRetryAt,
                createdAt: delivery.createdAt,
                updatedAt: delivery.updatedAt,
            })),
            createdAt: webhook.createdAt,
            updatedAt: webhook.updatedAt,
        };
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map