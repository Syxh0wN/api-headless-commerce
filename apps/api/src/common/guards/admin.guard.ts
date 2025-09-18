import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Token de acesso não fornecido');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;

      if (payload.role !== 'ADMIN' && payload.role !== 'STAFF') {
        throw new ForbiddenException('Acesso negado. Apenas administradores e staff podem acessar esta área.');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException('Token inválido ou expirado');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
