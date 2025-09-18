import { Injectable } from '@nestjs/common';
import { PrismaService } from './infra/prisma/prisma.service';
import { RedisService } from './infra/redis/redis.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  getHello(): string {
    return 'Headless Commerce API - Funcionando!';
  }

  async getHealth() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'unknown',
        redis: 'unknown',
      },
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      health.services.database = 'healthy';
    } catch (error) {
      health.services.database = 'unhealthy';
      health.status = 'degraded';
    }

    try {
      await this.redis.ping();
      health.services.redis = 'healthy';
    } catch (error) {
      health.services.redis = 'unhealthy';
      health.status = 'degraded';
    }

    return health;
  }

  async getReadiness() {
    const readiness = {
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        database: false,
        redis: false,
      },
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      readiness.services.database = true;
    } catch (error) {
      readiness.services.database = false;
    }

    try {
      await this.redis.ping();
      readiness.services.redis = true;
    } catch (error) {
      readiness.services.redis = false;
    }

    const allServicesReady = Object.values(readiness.services).every(Boolean);
    readiness.status = allServicesReady ? 'ready' : 'not_ready';

    return readiness;
  }
}
