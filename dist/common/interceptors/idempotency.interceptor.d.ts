import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../../infra/redis/redis.service';
export declare class IdempotencyInterceptor implements NestInterceptor {
    private readonly redisService;
    constructor(redisService: RedisService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
