"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
let ObservabilityModule = class ObservabilityModule {
};
exports.ObservabilityModule = ObservabilityModule;
exports.ObservabilityModule = ObservabilityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_prometheus_1.PrometheusModule.register({
                defaultMetrics: {
                    enabled: true,
                    config: {
                        prefix: 'headless_commerce_',
                    },
                },
                path: '/metrics',
                defaultLabels: {
                    app: 'headless-commerce-api',
                    version: '1.0.0',
                },
            }),
        ],
        exports: [nestjs_prometheus_1.PrometheusModule],
    })
], ObservabilityModule);
//# sourceMappingURL=observability.module.js.map