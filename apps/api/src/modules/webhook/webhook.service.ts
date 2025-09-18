import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { WebhookEventDto, WebhookEventType, WebhookSource } from './dto/webhook-event.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { WebhookResponseDto } from './dto/webhook-response.dto';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private prisma: PrismaService) {}

  async createWebhook(createWebhookDto: CreateWebhookDto): Promise<WebhookResponseDto> {
    const webhook = await this.prisma.webhook.create({
      data: {
        url: createWebhookDto.url,
        events: createWebhookDto.events || Object.values(WebhookEventType),
        isActive: createWebhookDto.isActive ?? true,
        secret: createWebhookDto.secret || '',
      },
      include: {
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    return this.mapWebhookToResponse(webhook);
  }

  async getWebhooks(): Promise<WebhookResponseDto[]> {
    const webhooks = await this.prisma.webhook.findMany({
      include: {
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return webhooks.map((webhook) => this.mapWebhookToResponse(webhook));
  }

  async getWebhook(id: string): Promise<WebhookResponseDto> {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id },
      include: {
        deliveries: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!webhook) {
      throw new BadRequestException('Webhook não encontrado');
    }

    return this.mapWebhookToResponse(webhook);
  }

  async updateWebhook(id: string, updateData: Partial<CreateWebhookDto>): Promise<WebhookResponseDto> {
    const webhook = await this.prisma.webhook.update({
      where: { id },
      data: updateData,
      include: {
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return this.mapWebhookToResponse(webhook);
  }

  async deleteWebhook(id: string): Promise<{ message: string }> {
    await this.prisma.webhook.delete({
      where: { id },
    });

    return { message: 'Webhook removido com sucesso' };
  }

  async processWebhookEvent(webhookEventDto: WebhookEventDto): Promise<void> {
    this.logger.log(`Processando evento: ${webhookEventDto.eventType}`);

    const webhooks = await this.prisma.webhook.findMany({
      where: {
        isActive: true,
        events: {
          has: webhookEventDto.eventType,
        },
      },
    });

    for (const webhook of webhooks) {
      await this.deliverWebhook(webhook.id, webhookEventDto);
    }
  }

  async deliverWebhook(webhookId: string, event: WebhookEventDto): Promise<void> {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook || !webhook.isActive) {
      return;
    }

    const delivery = await this.prisma.webhookDelivery.create({
      data: {
        webhookId,
        event: event.eventType,
        payload: event as any,
        status: DeliveryStatus.PENDING,
        attempts: 0,
      },
    });

    await this.executeDelivery(delivery.id);
  }

  async executeDelivery(deliveryId: string): Promise<void> {
    const delivery = await this.prisma.webhookDelivery.findUnique({
      where: { id: deliveryId },
      include: { webhook: true },
    });

    if (!delivery) {
      return;
    }

    const maxAttempts = 5;
    const baseDelay = 1000;

    if (delivery.attempts >= maxAttempts) {
        await this.prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            status: DeliveryStatus.FAILED,
          },
        });
      return;
    }

    try {
      const response = await fetch(delivery.webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': this.generateSignature(JSON.stringify(delivery.payload), delivery.webhook.secret),
          'X-Webhook-Event': delivery.event,
        },
        body: JSON.stringify(delivery.payload),
      });

      if (response.ok) {
        await this.prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            status: DeliveryStatus.DELIVERED,
            response: await response.json().catch(() => ({ status: response.status })),
            attempts: delivery.attempts + 1,
            deliveredAt: new Date(),
          },
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const nextRetryAt = new Date(Date.now() + baseDelay * Math.pow(2, delivery.attempts));

      await this.prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          status: DeliveryStatus.FAILED,
          response: { error: error.message, status: error.status || 0 },
          attempts: delivery.attempts + 1,
          nextRetryAt,
        },
      });

      setTimeout(() => {
        this.executeDelivery(deliveryId);
      }, baseDelay * Math.pow(2, delivery.attempts));
    }
  }

  async retryFailedDeliveries(): Promise<void> {
    const failedDeliveries = await this.prisma.webhookDelivery.findMany({
      where: {
        status: DeliveryStatus.FAILED,
        attempts: { lt: 5 },
        nextRetryAt: { lte: new Date() },
      },
      include: { webhook: true },
    });

    for (const delivery of failedDeliveries) {
      if (delivery.webhook.isActive) {
        await this.executeDelivery(delivery.id);
      }
    }
  }

  async getDeliveryStats(): Promise<{
    total: number;
    delivered: number;
    failed: number;
    pending: number;
  }> {
    const stats = await this.prisma.webhookDelivery.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const result = {
      total: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
    };

    for (const stat of stats) {
      result.total += stat._count.status;
      switch (stat.status) {
        case DeliveryStatus.DELIVERED:
          result.delivered = stat._count.status;
          break;
        case DeliveryStatus.FAILED:
          result.failed = stat._count.status;
          break;
        case DeliveryStatus.PENDING:
          result.pending = stat._count.status;
          break;
      }
    }

    return result;
  }

  private generateSignature(payload: string, secret?: string): string {
    if (!secret) {
      return '';
    }

    const crypto = require('crypto');
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  private mapWebhookToResponse(webhook: any): WebhookResponseDto {
    return {
      id: webhook.id,
      name: webhook.url, // Usando URL como nome temporário
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive,
      secret: webhook.secret ? '***' : undefined,
      deliveries: webhook.deliveries.map((delivery: any) => ({
        id: delivery.id,
        webhookId: delivery.webhookId,
        url: webhook.url,
        status: delivery.status,
        statusCode: delivery.response?.status,
        responseBody: delivery.response ? JSON.stringify(delivery.response) : undefined,
        attempts: delivery.attempts,
        lastAttemptAt: delivery.deliveredAt,
        nextRetryAt: delivery.nextRetryAt,
        createdAt: delivery.createdAt,
        updatedAt: delivery.updatedAt,
      })),
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt,
    };
  }
}
