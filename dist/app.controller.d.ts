import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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
