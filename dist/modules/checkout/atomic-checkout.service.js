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
exports.AtomicCheckoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let AtomicCheckoutService = class AtomicCheckoutService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processCheckout(userId, cartId, createOrderDto, idempotencyKey) {
        return {
            id: 'temp-order-id',
            orderNumber: `ORD-${Date.now()}`,
            userId,
            status: 'PENDING',
            subtotal: 0,
            shippingCost: 0,
            taxAmount: 0,
            discountAmount: 0,
            total: 0,
            paymentMethod: createOrderDto.paymentMethod,
            paymentStatus: 'PENDING',
            shippingAddress: createOrderDto.shippingAddress,
            items: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
};
exports.AtomicCheckoutService = AtomicCheckoutService;
exports.AtomicCheckoutService = AtomicCheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AtomicCheckoutService);
//# sourceMappingURL=atomic-checkout.service.js.map