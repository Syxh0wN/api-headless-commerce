import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class IdempotencyInterceptor implements NestInterceptor {
    constructor();
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
