import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    
    if (!apiKey) {
      throw new UnauthorizedException('API Key nao fornecida');
    }
    
    if (apiKey !== process.env.API_KEY_SECRET) {
      throw new UnauthorizedException('API Key invalida');
    }
    
    return true;
  }
}
