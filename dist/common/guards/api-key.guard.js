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
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("../auth/api-key.service");
let ApiKeyGuard = class ApiKeyGuard {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = this.extractApiKeyFromHeader(request);
        if (!apiKey) {
            throw new common_1.UnauthorizedException('API Key não fornecida');
        }
        const validation = await this.apiKeyService.validateApiKey(apiKey);
        if (!validation.isValid) {
            throw new common_1.UnauthorizedException('API Key inválida ou expirada');
        }
        request.user = {
            id: 'api-key-user',
            role: validation.role,
            type: 'api-key',
        };
        return true;
    }
    extractApiKeyFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        const apiKeyHeader = request.headers['x-api-key'];
        if (apiKeyHeader) {
            return apiKeyHeader;
        }
        return undefined;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map