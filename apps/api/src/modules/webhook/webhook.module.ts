import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookV1Controller } from './webhook-v1.controller';
import { WebhookService } from './webhook.service';
import { WebhookEventService } from './webhook-event.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WebhookController, WebhookV1Controller],
  providers: [WebhookService, WebhookEventService, PrismaService],
  exports: [WebhookService, WebhookEventService],
})
export class WebhookModule {}
