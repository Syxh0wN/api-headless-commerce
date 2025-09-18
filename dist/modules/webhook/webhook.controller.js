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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const webhook_event_service_1 = require("./webhook-event.service");
const api_key_guard_1 = require("../../common/guards/api-key.guard");
let WebhookController = class WebhookController {
    constructor(webhookEventService) {
        this.webhookEventService = webhookEventService;
    }
    async processWebhook(provider, payload, signature, externalId) {
        if (!signature || !externalId) {
            throw new Error('Headers X-Signature e X-External-ID são obrigatórios');
        }
        const result = await this.webhookEventService.processWebhookEvent(provider, {
            externalId,
            signature,
            payload,
            provider,
        });
        return {
            success: true,
            processed: result.processed,
            eventId: result.eventId,
            message: 'Webhook processado com sucesso',
        };
    }
    async testWebhook(provider, payload) {
        const testExternalId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const testSignature = 'test_signature';
        const result = await this.webhookEventService.processWebhookEvent(provider, {
            externalId: testExternalId,
            signature: testSignature,
            payload,
            provider,
        });
        return {
            success: true,
            processed: result.processed,
            eventId: result.eventId,
            message: 'Webhook de teste processado com sucesso',
        };
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)(':provider'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Processar webhook de provider específico' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Evento duplicado' }),
    (0, swagger_1.ApiHeader)({ name: 'X-Signature', description: 'Assinatura HMAC do webhook' }),
    (0, swagger_1.ApiHeader)({ name: 'X-External-ID', description: 'ID externo do evento' }),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-signature')),
    __param(3, (0, common_1.Headers)('x-external-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "processWebhook", null);
__decorate([
    (0, common_1.Post)(':provider/test'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Testar webhook (apenas para desenvolvimento)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook de teste processado' }),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "testWebhook", null);
exports.WebhookController = WebhookController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks v1'),
    (0, common_1.Controller)('v1/webhooks'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [webhook_event_service_1.WebhookEventService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map