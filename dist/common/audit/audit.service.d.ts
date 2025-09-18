import { PrismaService } from '../../infra/prisma/prisma.service';
export interface AuditLogData {
    actor: string;
    action: string;
    entity: string;
    entityId: string;
    diff?: any;
}
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: AuditLogData): Promise<void>;
    getAuditLogs(entity?: string, entityId?: string, actor?: string, limit?: number, offset?: number): Promise<any[]>;
    getEntityHistory(entity: string, entityId: string): Promise<any[]>;
}
