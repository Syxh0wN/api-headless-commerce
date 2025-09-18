import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async generateApiKey(role: string, expiresAt?: Date): Promise<{ key: string; hash: string }> {
    const key = `sk_${crypto.randomBytes(32).toString('hex')}`;
    const hash = crypto.createHash('sha256').update(key).digest('hex');

    await this.prisma.apiKey.create({
      data: {
        keyHash: hash,
        role,
        expiresAt,
      },
    });

    return { key, hash };
  }

  async validateApiKey(apiKey: string): Promise<{ role: string; isValid: boolean }> {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const apiKeyRecord = await this.prisma.apiKey.findUnique({
      where: { keyHash: hash },
    });

    if (!apiKeyRecord) {
      return { role: '', isValid: false };
    }

    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      return { role: '', isValid: false };
    }

    return { role: apiKeyRecord.role, isValid: true };
  }

  async revokeApiKey(apiKey: string): Promise<void> {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');

    await this.prisma.apiKey.delete({
      where: { keyHash: hash },
    });
  }

  async listApiKeys(): Promise<any[]> {
    return this.prisma.apiKey.findMany({
      select: {
        id: true,
        role: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
