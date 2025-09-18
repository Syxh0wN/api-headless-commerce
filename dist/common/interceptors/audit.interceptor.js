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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("../audit/audit.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const handler = context.getHandler();
        const className = context.getClass().name;
        const method = request.method;
        const url = request.url;
        const user = request.user;
        return next.handle().pipe((0, operators_1.tap)(async (data) => {
            if (this.shouldAudit(method, url)) {
                const actor = user?.id || user?.email || 'anonymous';
                const action = `${method} ${className}.${handler.name}`;
                const entity = this.extractEntityFromUrl(url);
                const entityId = this.extractEntityIdFromUrl(url) || data?.id;
                if (entity && entityId) {
                    await this.auditService.log({
                        actor,
                        action,
                        entity,
                        entityId,
                        diff: {
                            method,
                            url,
                            statusCode: response.statusCode,
                            timestamp: new Date().toISOString(),
                        },
                    });
                }
            }
        }));
    }
    shouldAudit(method, url) {
        const criticalEndpoints = [
            '/products',
            '/orders',
            '/payments',
            '/promo-codes',
            '/admin',
        ];
        const isCriticalEndpoint = criticalEndpoints.some(endpoint => url.includes(endpoint));
        const isModificationMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        return isCriticalEndpoint && isModificationMethod;
    }
    extractEntityFromUrl(url) {
        const patterns = [
            { pattern: /\/products(?:\/([^\/]+))?/, entity: 'products' },
            { pattern: /\/orders(?:\/([^\/]+))?/, entity: 'orders' },
            { pattern: /\/payments(?:\/([^\/]+))?/, entity: 'payments' },
            { pattern: /\/promo-codes(?:\/([^\/]+))?/, entity: 'promo_codes' },
            { pattern: /\/admin\/products(?:\/([^\/]+))?/, entity: 'products' },
            { pattern: /\/admin\/orders(?:\/([^\/]+))?/, entity: 'orders' },
        ];
        for (const { pattern, entity } of patterns) {
            if (pattern.test(url)) {
                return entity;
            }
        }
        return null;
    }
    extractEntityIdFromUrl(url) {
        const match = url.match(/\/([a-zA-Z0-9-]+)(?:\/|$)/);
        return match ? match[1] : null;
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map