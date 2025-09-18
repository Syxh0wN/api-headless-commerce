import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeyService } from '../auth/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException('API Key não fornecida');
    }

    const validation = await this.apiKeyService.validateApiKey(apiKey);

    if (!validation.isValid) {
      throw new UnauthorizedException('API Key inválida ou expirada');
    }

    // Adicionar informações do usuário ao request
    request.user = {
      id: 'api-key-user',
      role: validation.role,
      type: 'api-key',
    };

    return true;
  }

  private extractApiKeyFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const apiKeyHeader = request.headers['x-api-key'];
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    return undefined;
  }
}