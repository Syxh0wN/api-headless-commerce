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
exports.IdempotencyInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const redis_service_1 = require("../../infra/redis/redis.service");
let IdempotencyInterceptor = class IdempotencyInterceptor {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const idempotencyKey = request.headers['idempotency-key'];
        if (!idempotencyKey) {
            throw new common_1.BadRequestException('Idempotency-Key header é obrigatório');
        }
        const cacheKey = `idempotency:${idempotencyKey}`;
        const cachedResponse = await this.redisService.get(cacheKey);
        if (cachedResponse) {
            const parsedResponse = JSON.parse(cachedResponse);
            response.status(parsedResponse.status).json(parsedResponse.data);
            return new rxjs_1.Observable(subscriber => {
                subscriber.next(parsedResponse.data);
                subscriber.complete();
            });
        }
        return next.handle().pipe((0, operators_1.tap)(async (data) => {
            const responseData = {
                status: response.statusCode,
                data,
                timestamp: new Date().toISOString(),
            };
            await this.redisService.set(cacheKey, JSON.stringify(responseData), 24 * 60 * 60);
        }));
    }
};
exports.IdempotencyInterceptor = IdempotencyInterceptor;
exports.IdempotencyInterceptor = IdempotencyInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], IdempotencyInterceptor);
//# sourceMappingURL=idempotency.interceptor.js.map