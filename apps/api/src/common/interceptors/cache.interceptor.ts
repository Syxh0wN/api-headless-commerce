import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const url = request.url;
    const method = request.method;

    if (method !== 'GET') {
      return next.handle();
    }

    const cacheKey = this.generateCacheKey(url, request.query);
    const clientETag = request.headers['if-none-match'];

    return next.handle().pipe(
      tap((data) => {
        const etag = this.generateETag(data);
        
        if (clientETag === etag) {
          response.status(304).end();
          return;
        }

        response.set({
          'ETag': etag,
          'Cache-Control': this.getCacheControl(url),
          'Last-Modified': new Date().toUTCString(),
        });
      }),
    );
  }

  private generateCacheKey(url: string, query: any): string {
    const queryString = new URLSearchParams(query).toString();
    return `${url}${queryString ? `?${queryString}` : ''}`;
  }

  private generateETag(data: any): string {
    const content = JSON.stringify(data);
    return `"${crypto.createHash('md5').update(content).digest('hex')}"`;
  }

  private getCacheControl(url: string): string {
    if (url.includes('/products')) {
      return 'public, max-age=60, stale-while-revalidate=300';
    }
    
    if (url.includes('/products/') && !url.includes('/products?')) {
      return 'public, max-age=300, stale-while-revalidate=600';
    }

    return 'public, max-age=30';
  }
}
