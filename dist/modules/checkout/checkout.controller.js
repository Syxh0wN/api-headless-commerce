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
exports.CheckoutController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../common/guards/auth.guard");
const idempotency_interceptor_1 = require("../../common/interceptors/idempotency.interceptor");
const atomic_checkout_service_1 = require("./atomic-checkout.service");
const create_order_dto_1 = require("./dto/create-order.dto");
let CheckoutController = class CheckoutController {
    constructor(atomicCheckoutService) {
        this.atomicCheckoutService = atomicCheckoutService;
    }
    async createOrder(req, createOrderDto, idempotencyKey) {
        if (!idempotencyKey) {
            throw new Error('Header Idempotency-Key é obrigatório');
        }
        return this.atomicCheckoutService.processCheckout(req.user.id, createOrderDto.cartId, createOrderDto, idempotencyKey);
    }
    async getOrder(req, id) {
        throw new Error('Implementar busca de pedido');
    }
    async listOrders(req) {
        throw new Error('Implementar listagem de pedidos');
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Processar checkout com idempotência' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pedido criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflito de estoque' }),
    (0, swagger_1.ApiHeader)({
        name: 'Idempotency-Key',
        description: 'Chave de idempotência para evitar duplicação',
        required: true
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto, String]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter pedido por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pedido obtido com sucesso' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar pedidos do usuário' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pedidos' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "listOrders", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, swagger_1.ApiTags)('Checkout v1'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('v1/checkout'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [atomic_checkout_service_1.AtomicCheckoutService])
], CheckoutController);
//# sourceMappingURL=checkout.controller.js.map