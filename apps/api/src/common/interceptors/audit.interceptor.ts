import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const handler = context.getHandler();
    const className = context.getClass().name;

    const method = request.method;
    const url = request.url;
    const user = request.user;

    return next.handle().pipe(
      tap(async (data) => {
        // Log apenas operações críticas
        if (this.shouldAudit(method, url)) {
          const actor = user?.id || user?.email || 'anonymous';
          const action = `${method} ${className}.${handler.name}`;
          const entity = this.extractEntityFromUrl(url);
          const entityId = this.extractEntityIdFromUrl(url) || data?.id;

          if (entity && entityId) {
            await this.auditService.log({
              actor,
              action,
              entity,
              entityId,
              diff: {
                method,
                url,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
              },
            });
          }
        }
      }),
    );
  }

  private shouldAudit(method: string, url: string): boolean {
    // Auditar apenas operações de modificação em endpoints críticos
    const criticalEndpoints = [
      '/products',
      '/orders',
      '/payments',
      '/promo-codes',
      '/admin',
    ];

    const isCriticalEndpoint = criticalEndpoints.some(endpoint => 
      url.includes(endpoint)
    );

    const isModificationMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    return isCriticalEndpoint && isModificationMethod;
  }

  private extractEntityFromUrl(url: string): string | null {
    const patterns = [
      { pattern: /\/products(?:\/([^\/]+))?/, entity: 'products' },
      { pattern: /\/orders(?:\/([^\/]+))?/, entity: 'orders' },
      { pattern: /\/payments(?:\/([^\/]+))?/, entity: 'payments' },
      { pattern: /\/promo-codes(?:\/([^\/]+))?/, entity: 'promo_codes' },
      { pattern: /\/admin\/products(?:\/([^\/]+))?/, entity: 'products' },
      { pattern: /\/admin\/orders(?:\/([^\/]+))?/, entity: 'orders' },
    ];

    for (const { pattern, entity } of patterns) {
      if (pattern.test(url)) {
        return entity;
      }
    }

    return null;
  }

  private extractEntityIdFromUrl(url: string): string | null {
    const match = url.match(/\/([a-zA-Z0-9-]+)(?:\/|$)/);
    return match ? match[1] : null;
  }
}
