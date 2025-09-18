import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ApiKeyService } from '../auth/api-key.service';
export declare class ApiKeyGuard implements CanActivate {
    private apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractApiKeyFromHeader;
}
