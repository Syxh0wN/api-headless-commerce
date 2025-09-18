import { PrismaService } from './infra/prisma/prisma.service';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        version: string;
        environment: string;
        services: {
            database: string;
        };
    }>;
    getReadiness(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: boolean;
        };
    }>;
}
