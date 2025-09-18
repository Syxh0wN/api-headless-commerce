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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_guard_1 = require("../../common/guards/admin.guard");
const audit_interceptor_1 = require("../../common/interceptors/audit.interceptor");
const admin_service_1 = require("./admin.service");
const create_product_dto_1 = require("../products/dto/create-product.dto");
const update_product_dto_1 = require("../products/dto/update-product.dto");
const create_coupon_dto_1 = require("./dto/create-coupon.dto");
const update_coupon_dto_1 = require("./dto/update-coupon.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async createProduct(createProductDto) {
        return this.adminService.createProduct(createProductDto);
    }
    async updateProduct(id, updateProductDto) {
        return this.adminService.updateProduct(id, updateProductDto);
    }
    async removeProduct(id) {
        await this.adminService.removeProduct(id);
    }
    async createVariant(productId, createVariantDto) {
        return this.adminService.createVariant(productId, createVariantDto);
    }
    async updateStock(variantId, stockDto) {
        return this.adminService.updateStock(variantId, stockDto.quantity);
    }
    async createPromoCode(createCouponDto) {
        return this.adminService.createPromoCode(createCouponDto);
    }
    async updatePromoCode(id, updateCouponDto) {
        return this.adminService.updatePromoCode(id, updateCouponDto);
    }
    async removePromoCode(id) {
        await this.adminService.removePromoCode(id);
    }
    async listOrders() {
        return this.adminService.listOrders();
    }
    async updateOrderStatus(id, statusDto) {
        return this.adminService.updateOrderStatus(id, statusDto.status);
    }
    async generateApiKey(keyDto) {
        return this.adminService.generateApiKey(keyDto.role, keyDto.expiresAt);
    }
    async listApiKeys() {
        return this.adminService.listApiKeys();
    }
    async getAuditLogs(entity, entityId) {
        return this.adminService.getAuditLogs(entity, entityId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar produto (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Produto criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar produto (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produto atualizado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover produto (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Produto removido com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeProduct", null);
__decorate([
    (0, common_1.Post)('products/:id/variants'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar variante de produto (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Variante criada com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createVariant", null);
__decorate([
    (0, common_1.Patch)('variants/:id/stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar estoque da variante (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estoque atualizado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Post)('promo-codes'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar código promocional (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Código promocional criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createPromoCode", null);
__decorate([
    (0, common_1.Patch)('promo-codes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar código promocional (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Código promocional atualizado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_coupon_dto_1.UpdateCouponDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updatePromoCode", null);
__decorate([
    (0, common_1.Delete)('promo-codes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover código promocional (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Código promocional removido com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removePromoCode", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os pedidos (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pedidos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar status do pedido (RBAC: ADMIN/STAFF)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status do pedido atualizado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Post)('api-keys'),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar nova API Key (RBAC: ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'API Key gerada com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "generateApiKey", null);
__decorate([
    (0, common_1.Get)('api-keys'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar API Keys (RBAC: ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de API Keys' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listApiKeys", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Visualizar logs de auditoria (RBAC: ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logs de auditoria' }),
    __param(0, (0, common_1.Param)('entity')),
    __param(1, (0, common_1.Param)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin v1'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('v1/admin'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map