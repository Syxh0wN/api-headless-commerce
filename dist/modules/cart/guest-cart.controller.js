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
exports.GuestCartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guest_cart_service_1 = require("./guest-cart.service");
const add_to_cart_dto_1 = require("./dto/add-to-cart.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
const apply_promo_dto_1 = require("./dto/apply-promo.dto");
let GuestCartController = class GuestCartController {
    constructor(guestCartService) {
        this.guestCartService = guestCartService;
    }
    async createCart(res) {
        const cart = await this.guestCartService.createCart();
        res.cookie('cart_session', cart.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({
            cartId: cart.id,
            sessionId: cart.sessionId,
        });
    }
    async addItem(cartId, addToCartDto, req) {
        const sessionId = req.cookies?.cart_session;
        return this.guestCartService.addItem(cartId, sessionId, addToCartDto);
    }
    async updateItem(cartId, itemId, updateCartItemDto, req) {
        const sessionId = req.cookies?.cart_session;
        return this.guestCartService.updateItem(cartId, sessionId, itemId, updateCartItemDto);
    }
    async removeItem(cartId, itemId, req) {
        const sessionId = req.cookies?.cart_session;
        return this.guestCartService.removeItem(cartId, sessionId, itemId);
    }
    async applyPromo(cartId, applyPromoDto, req) {
        const sessionId = req.cookies?.cart_session;
        return this.guestCartService.applyPromo(cartId, sessionId, applyPromoDto);
    }
    async getCart(cartId, req) {
        const sessionId = req.cookies?.cart_session;
        return this.guestCartService.getCart(cartId, sessionId);
    }
};
exports.GuestCartController = GuestCartController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar carrinho para guest' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Carrinho criado com sucesso' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuestCartController.prototype, "createCart", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar item ao carrinho' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item adicionado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_to_cart_dto_1.AddToCartDto, Object]),
    __metadata("design:returntype", Promise)
], GuestCartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)(':id/items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar quantidade do item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item atualizado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_cart_item_dto_1.UpdateCartItemDto, Object]),
    __metadata("design:returntype", Promise)
], GuestCartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover item do carrinho' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removido com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GuestCartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Post)(':id/apply-promo'),
    (0, swagger_1.ApiOperation)({ summary: 'Aplicar código promocional' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Código aplicado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, apply_promo_dto_1.ApplyPromoDto, Object]),
    __metadata("design:returntype", Promise)
], GuestCartController.prototype, "applyPromo", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter carrinho com totais recalculados' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Carrinho obtido com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GuestCartController.prototype, "getCart", null);
exports.GuestCartController = GuestCartController = __decorate([
    (0, swagger_1.ApiTags)('Guest Cart'),
    (0, common_1.Controller)('v1/carts'),
    __metadata("design:paramtypes", [guest_cart_service_1.GuestCartService])
], GuestCartController);
//# sourceMappingURL=guest-cart.controller.js.map