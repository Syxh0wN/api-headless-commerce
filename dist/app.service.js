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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./infra/prisma/prisma.service");
let AppService = class AppService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getHello() {
        return 'Headless Commerce API - Funcionando!';
    }
    async getHealth() {
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            services: {
                database: 'unknown',
            },
        };
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            health.services.database = 'healthy';
        }
        catch (error) {
            health.services.database = 'unhealthy';
            health.status = 'degraded';
        }
        return health;
    }
    async getReadiness() {
        const readiness = {
            status: 'ready',
            timestamp: new Date().toISOString(),
            services: {
                database: false,
            },
        };
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            readiness.services.database = true;
        }
        catch (error) {
            readiness.services.database = false;
        }
        const allServicesReady = Object.values(readiness.services).every(Boolean);
        readiness.status = allServicesReady ? 'ready' : 'not_ready';
        return readiness;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map