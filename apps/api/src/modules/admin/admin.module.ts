import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ApiKeyService } from '../../common/auth/api-key.service';
import { AuditService } from '../../common/audit/audit.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AdminController],
  providers: [AdminService, ApiKeyService, AuditService, PrismaService],
  exports: [AdminService, ApiKeyService, AuditService],
})
export class AdminModule {}
