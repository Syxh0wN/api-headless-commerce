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
exports.GuestCartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let GuestCartService = class GuestCartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCart() {
        const cart = await this.prisma.cart.create({
            data: {
                sessionId: `session_${Date.now()}`,
                status: 'OPEN',
                currency: 'BRL',
            },
        });
        return cart;
    }
    async addItem(cartId, sessionId, addToCartDto) {
        return { message: 'Item adicionado ao carrinho' };
    }
    async updateItem(cartId, sessionId, itemId, updateCartItemDto) {
        return { message: 'Item atualizado no carrinho' };
    }
    async removeItem(cartId, sessionId, itemId) {
        return { message: 'Item removido do carrinho' };
    }
    async applyPromo(cartId, sessionId, applyPromoDto) {
        return { message: 'Código promocional aplicado' };
    }
    async getCart(cartId, sessionId) {
        return {
            id: cartId,
            sessionId,
            items: [],
            totalItems: 0,
            total: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
};
exports.GuestCartService = GuestCartService;
exports.GuestCartService = GuestCartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GuestCartService);
//# sourceMappingURL=guest-cart.service.js.map