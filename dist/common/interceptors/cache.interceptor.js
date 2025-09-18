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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const crypto = __importStar(require("crypto"));
let CacheInterceptor = class CacheInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const url = request.url;
        const method = request.method;
        if (method !== 'GET') {
            return next.handle();
        }
        const cacheKey = this.generateCacheKey(url, request.query);
        const clientETag = request.headers['if-none-match'];
        return next.handle().pipe((0, operators_1.tap)((data) => {
            const etag = this.generateETag(data);
            if (clientETag === etag) {
                response.status(304).end();
                return;
            }
            response.set({
                'ETag': etag,
                'Cache-Control': this.getCacheControl(url),
                'Last-Modified': new Date().toUTCString(),
            });
        }));
    }
    generateCacheKey(url, query) {
        const queryString = new URLSearchParams(query).toString();
        return `${url}${queryString ? `?${queryString}` : ''}`;
    }
    generateETag(data) {
        const content = JSON.stringify(data);
        return `"${crypto.createHash('md5').update(content).digest('hex')}"`;
    }
    getCacheControl(url) {
        if (url.includes('/products')) {
            return 'public, max-age=60, stale-while-revalidate=300';
        }
        if (url.includes('/products/') && !url.includes('/products?')) {
            return 'public, max-age=300, stale-while-revalidate=600';
        }
        return 'public, max-age=30';
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_1.Injectable)()
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map