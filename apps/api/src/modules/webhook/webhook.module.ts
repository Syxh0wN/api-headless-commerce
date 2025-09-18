import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WebhookController],
  providers: [WebhookService, PrismaService],
  exports: [WebhookService],
})
export class WebhookModule {}
