import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_URL: z.ZodString;
    REDIS_HOST: z.ZodDefault<z.ZodString>;
    REDIS_PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    REDIS_PASSWORD: z.ZodOptional<z.ZodString>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    API_KEY_SECRET: z.ZodString;
    WEBHOOK_SECRET: z.ZodString;
    MEILISEARCH_HOST: z.ZodOptional<z.ZodString>;
    MEILISEARCH_API_KEY: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AppConfig = z.infer<typeof configSchema>;
export declare const validateConfig: (config: Record<string, unknown>) => {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    API_KEY_SECRET: string;
    WEBHOOK_SECRET: string;
    REDIS_PASSWORD?: string | undefined;
    MEILISEARCH_HOST?: string | undefined;
    MEILISEARCH_API_KEY?: string | undefined;
};
export {};
