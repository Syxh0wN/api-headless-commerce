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
import { RedisService } from '../../infra/redis/redis.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const idempotencyKey = request.headers['idempotency-key'] as string;

    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header é obrigatório');
    }

    const cacheKey = `idempotency:${idempotencyKey}`;
    const cachedResponse = await this.redisService.get(cacheKey);

    if (cachedResponse) {
      const parsedResponse = JSON.parse(cachedResponse);
      response.status(parsedResponse.status).json(parsedResponse.data);
      return new Observable(subscriber => {
        subscriber.next(parsedResponse.data);
        subscriber.complete();
      });
    }

    return next.handle().pipe(
      tap(async (data) => {
        const responseData = {
          status: response.statusCode,
          data,
          timestamp: new Date().toISOString(),
        };

        await this.redisService.set(
          cacheKey,
          JSON.stringify(responseData),
          24 * 60 * 60, // 24 horas
        );
      }),
    );
  }
}
