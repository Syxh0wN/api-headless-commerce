"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("redis");
let RedisService = class RedisService {
    async onModuleInit() {
        if (process.env.REDIS_ENABLED === 'true') {
            try {
                this.client = (0, redis_1.createClient)({
                    socket: {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT || '6379'),
                    },
                    password: process.env.REDIS_PASSWORD,
                });
                this.client.on('error', (err) => {
                    console.error('Redis Client Error', err);
                });
                await this.client.connect();
                console.log('Redis conectado com sucesso');
            }
            catch (error) {
                console.warn('Redis não disponível, continuando sem cache:', error.message);
                this.client = null;
            }
        }
        else {
            console.log('Redis desabilitado - usando modo sem cache');
            this.client = null;
        }
    }
    async onModuleDestroy() {
        if (this.client) {
            await this.client.disconnect();
        }
    }
    getClient() {
        return this.client;
    }
    async set(key, value, ttl) {
        if (!this.client)
            return;
        try {
            if (ttl) {
                await this.client.setEx(key, ttl, value);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (error) {
            console.warn('Redis set error:', error.message);
        }
    }
    async get(key) {
        if (!this.client)
            return null;
        try {
            const result = await this.client.get(key);
            return result;
        }
        catch (error) {
            console.warn('Redis get error:', error.message);
            return null;
        }
    }
    async del(key) {
        if (!this.client)
            return;
        try {
            await this.client.del(key);
        }
        catch (error) {
            console.warn('Redis del error:', error.message);
        }
    }
    async exists(key) {
        if (!this.client)
            return false;
        try {
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            console.warn('Redis exists error:', error.message);
            return false;
        }
    }
    async lock(key, ttl = 30) {
        if (!this.client)
            return false;
        try {
            const lockKey = `lock:${key}`;
            const result = await this.client.set(lockKey, '1', {
                EX: ttl,
                NX: true,
            });
            return result === 'OK';
        }
        catch (error) {
            console.warn('Redis lock error:', error.message);
            return false;
        }
    }
    async unlock(key) {
        if (!this.client)
            return;
        try {
            const lockKey = `lock:${key}`;
            await this.client.del(lockKey);
        }
        catch (error) {
            console.warn('Redis unlock error:', error.message);
        }
    }
    async ping() {
        if (!this.client)
            return 'Redis não disponível';
        try {
            return await this.client.ping();
        }
        catch (error) {
            console.warn('Redis ping error:', error.message);
            return 'Redis não disponível';
        }
    }
    async connect() {
        if (!this.client)
            return;
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
        }
        catch (error) {
            console.warn('Redis connect error:', error.message);
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)()
], RedisService);
//# sourceMappingURL=redis.service.js.map