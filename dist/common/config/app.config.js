"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
const zod_1 = require("zod");
const configSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: zod_1.z.coerce.number().default(3000),
    DATABASE_URL: zod_1.z.string().min(1),
    REDIS_HOST: zod_1.z.string().default('localhost'),
    REDIS_PORT: zod_1.z.coerce.number().default(6379),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    API_KEY_SECRET: zod_1.z.string().min(32),
    WEBHOOK_SECRET: zod_1.z.string().min(32),
    MEILISEARCH_HOST: zod_1.z.string().optional(),
    MEILISEARCH_API_KEY: zod_1.z.string().optional(),
});
const validateConfig = (config) => {
    return configSchema.parse(config);
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=app.config.js.map