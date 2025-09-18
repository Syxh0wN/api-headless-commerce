import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WebhookEventService } from './webhook-event.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookEventService, PrismaService],
  exports: [WebhookService, WebhookEventService],
})
export class WebhookModule {}
