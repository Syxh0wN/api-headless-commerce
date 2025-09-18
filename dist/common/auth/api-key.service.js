"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let ApiKeyService = class ApiKeyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateApiKey(role, expiresAt) {
        const key = `sk_${crypto.randomBytes(32).toString('hex')}`;
        const hash = crypto.createHash('sha256').update(key).digest('hex');
        await this.prisma.apiKey.create({
            data: {
                keyHash: hash,
                role,
                expiresAt,
            },
        });
        return { key, hash };
    }
    async validateApiKey(apiKey) {
        const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
        const apiKeyRecord = await this.prisma.apiKey.findUnique({
            where: { keyHash: hash },
        });
        if (!apiKeyRecord) {
            return { role: '', isValid: false };
        }
        if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
            return { role: '', isValid: false };
        }
        return { role: apiKeyRecord.role, isValid: true };
    }
    async revokeApiKey(apiKey) {
        const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
        await this.prisma.apiKey.delete({
            where: { keyHash: hash },
        });
    }
    async listApiKeys() {
        return this.prisma.apiKey.findMany({
            select: {
                id: true,
                role: true,
                expiresAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
};
exports.ApiKeyService = ApiKeyService;
exports.ApiKeyService = ApiKeyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiKeyService);
//# sourceMappingURL=api-key.service.js.map