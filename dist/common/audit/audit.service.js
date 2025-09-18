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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(data) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    actor: data.actor,
                    action: data.action,
                    entity: data.entity,
                    entityId: data.entityId,
                    diff: data.diff ? JSON.stringify(data.diff) : null,
                },
            });
        }
        catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }
    async getAuditLogs(entity, entityId, actor, limit = 100, offset = 0) {
        const where = {};
        if (entity)
            where.entity = entity;
        if (entityId)
            where.entityId = entityId;
        if (actor)
            where.actor = actor;
        return this.prisma.auditLog.findMany({
            where,
            orderBy: { at: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    async getEntityHistory(entity, entityId) {
        return this.prisma.auditLog.findMany({
            where: {
                entity,
                entityId,
            },
            orderBy: { at: 'asc' },
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map