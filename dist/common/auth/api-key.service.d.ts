import { PrismaService } from '../../infra/prisma/prisma.service';
export declare class ApiKeyService {
    private prisma;
    constructor(prisma: PrismaService);
    generateApiKey(role: string, expiresAt?: Date): Promise<{
        key: string;
        hash: string;
    }>;
    validateApiKey(apiKey: string): Promise<{
        role: string;
        isValid: boolean;
    }>;
    revokeApiKey(apiKey: string): Promise<void>;
    listApiKeys(): Promise<any[]>;
}
