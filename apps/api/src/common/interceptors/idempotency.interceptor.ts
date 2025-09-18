import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
// import { RedisService } from '../../infra/redis/redis.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const idempotencyKey = request.headers['idempotency-key'] as string;

    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header é obrigatório');
    }

    // Temporariamente desabilitado - Redis não disponível
    // const cacheKey = `idempotency:${idempotencyKey}`;
    // const cachedResponse = await this.redisService.get(cacheKey);

    return next.handle();
  }
}
