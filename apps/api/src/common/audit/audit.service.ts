import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

export interface AuditLogData {
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  diff?: any;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actor: data.actor,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          diff: data.diff ? JSON.stringify(data.diff) : null,
        },
      });
    } catch (error) {
      // Log error but don't throw to avoid breaking the main flow
      console.error('Failed to create audit log:', error);
    }
  }

  async getAuditLogs(
    entity?: string,
    entityId?: string,
    actor?: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<any[]> {
    const where: any = {};

    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;
    if (actor) where.actor = actor;

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { at: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getEntityHistory(entity: string, entityId: string): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      where: {
        entity,
        entityId,
      },
      orderBy: { at: 'asc' },
    });
  }
}
