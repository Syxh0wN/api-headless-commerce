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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEventDto = exports.WebhookSource = exports.WebhookEventType = void 0;
const class_validator_1 = require("class-validator");
var WebhookEventType;
(function (WebhookEventType) {
    WebhookEventType["ORDER_CREATED"] = "ORDER_CREATED";
    WebhookEventType["ORDER_UPDATED"] = "ORDER_UPDATED";
    WebhookEventType["ORDER_CANCELLED"] = "ORDER_CANCELLED";
    WebhookEventType["PAYMENT_PROCESSED"] = "PAYMENT_PROCESSED";
    WebhookEventType["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    WebhookEventType["PAYMENT_REFUNDED"] = "PAYMENT_REFUNDED";
    WebhookEventType["SHIPMENT_CREATED"] = "SHIPMENT_CREATED";
    WebhookEventType["SHIPMENT_DELIVERED"] = "SHIPMENT_DELIVERED";
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
var WebhookSource;
(function (WebhookSource) {
    WebhookSource["INTERNAL"] = "INTERNAL";
    WebhookSource["STRIPE"] = "STRIPE";
    WebhookSource["PAGSEGURO"] = "PAGSEGURO";
    WebhookSource["MERCADOPAGO"] = "MERCADOPAGO";
    WebhookSource["CORREIOS"] = "CORREIOS";
})(WebhookSource || (exports.WebhookSource = WebhookSource = {}));
class WebhookEventDto {
}
exports.WebhookEventDto = WebhookEventDto;
__decorate([
    (0, class_validator_1.IsEnum)(WebhookEventType),
    __metadata("design:type", String)
], WebhookEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(WebhookSource),
    __metadata("design:type", String)
], WebhookEventDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookEventDto.prototype, "entityId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], WebhookEventDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WebhookEventDto.prototype, "signature", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WebhookEventDto.prototype, "timestamp", void 0);
//# sourceMappingURL=webhook-event.dto.js.map