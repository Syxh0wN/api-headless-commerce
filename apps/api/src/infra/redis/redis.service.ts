import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    // Redis desabilitado por padrão - só conecta se explicitamente habilitado
    if (process.env.REDIS_ENABLED === 'true') {
      try {
        this.client = createClient({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
          },
          password: process.env.REDIS_PASSWORD,
        });

        this.client.on('error', (err) => {
          console.error('Redis Client Error', err);
        });

        await this.client.connect();
        console.log('Redis conectado com sucesso');
      } catch (error) {
        console.warn('Redis não disponível, continuando sem cache:', error.message);
        this.client = null;
      }
    } else {
      console.log('Redis desabilitado - usando modo sem cache');
      this.client = null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
    }
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.client) return;
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.warn('Redis set error:', error.message);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) return null;
    try {
      const result = await this.client.get(key);
      return result as string | null;
    } catch (error) {
      console.warn('Redis get error:', error.message);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
    } catch (error) {
      console.warn('Redis del error:', error.message);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.warn('Redis exists error:', error.message);
      return false;
    }
  }

  async lock(key: string, ttl: number = 30): Promise<boolean> {
    if (!this.client) return false;
    try {
      const lockKey = `lock:${key}`;
      const result = await this.client.set(lockKey, '1', {
        EX: ttl,
        NX: true,
      });
      return result === 'OK';
    } catch (error) {
      console.warn('Redis lock error:', error.message);
      return false;
    }
  }

  async unlock(key: string): Promise<void> {
    if (!this.client) return;
    try {
      const lockKey = `lock:${key}`;
      await this.client.del(lockKey);
    } catch (error) {
      console.warn('Redis unlock error:', error.message);
    }
  }

  async ping(): Promise<string> {
    if (!this.client) return 'Redis não disponível';
    try {
      return await this.client.ping();
    } catch (error) {
      console.warn('Redis ping error:', error.message);
      return 'Redis não disponível';
    }
  }

  async connect(): Promise<void> {
    if (!this.client) return;
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
    } catch (error) {
      console.warn('Redis connect error:', error.message);
    }
  }
}
