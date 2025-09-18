import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import {
  WebhookEventDto,
  WebhookEventType,
  WebhookSource,
} from './dto/webhook-event.dto';
import { DeliveryStatus } from '@prisma/client';

describe('WebhookService', () => {
  let service: WebhookService;

  const mockWebhook = {
    id: 'webhook-1',
    url: 'https://example.com/webhook',
    events: [WebhookEventType.ORDER_CREATED],
    isActive: true,
    secret: 'test-secret',
    createdAt: new Date(),
    updatedAt: new Date(),
    deliveries: [],
  };

  const mockDelivery = {
    id: 'delivery-1',
    webhookId: 'webhook-1',
    event: WebhookEventType.ORDER_CREATED,
    payload: { test: 'data' },
    status: DeliveryStatus.PENDING,
    attempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    webhook: mockWebhook,
  };

  const mockPrismaService = {
    webhook: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    webhookDelivery: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWebhook', () => {
    const createWebhookDto: CreateWebhookDto = {
      name: 'Test Webhook',
      url: 'https://example.com/webhook',
      events: [WebhookEventType.ORDER_CREATED],
      isActive: true,
      secret: 'test-secret',
    };

    it('deve criar webhook com sucesso', async () => {
      mockPrismaService.webhook.create.mockResolvedValue(mockWebhook);

      const result = await service.createWebhook(createWebhookDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('webhook-1');
      expect(result.url).toBe('https://example.com/webhook');
      expect(mockPrismaService.webhook.create).toHaveBeenCalledWith({
        data: {
          url: createWebhookDto.url,
          events: createWebhookDto.events,
          isActive: createWebhookDto.isActive,
          secret: createWebhookDto.secret,
        },
        include: {
          deliveries: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
    });

    it('deve usar valores padrão quando não fornecidos', async () => {
      const minimalDto = {
        name: 'Test',
        url: 'https://example.com/webhook',
      };

      mockPrismaService.webhook.create.mockResolvedValue(mockWebhook);

      await service.createWebhook(minimalDto);

      expect(mockPrismaService.webhook.create).toHaveBeenCalledWith({
        data: {
          url: minimalDto.url,
          events: Object.values(WebhookEventType),
          isActive: true,
          secret: '',
        },
        include: expect.any(Object),
      });
    });
  });

  describe('getWebhooks', () => {
    it('deve retornar lista de webhooks', async () => {
      mockPrismaService.webhook.findMany.mockResolvedValue([mockWebhook]);

      const result = await service.getWebhooks();

      expect(result).toEqual([expect.objectContaining({ id: 'webhook-1' })]);
      expect(mockPrismaService.webhook.findMany).toHaveBeenCalledWith({
        include: {
          deliveries: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getWebhook', () => {
    it('deve retornar webhook quando encontrado', async () => {
      mockPrismaService.webhook.findUnique.mockResolvedValue(mockWebhook);

      const result = await service.getWebhook('webhook-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('webhook-1');
    });

    it('deve lançar BadRequestException quando webhook não encontrado', async () => {
      mockPrismaService.webhook.findUnique.mockResolvedValue(null);

      await expect(service.getWebhook('webhook-999')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateWebhook', () => {
    const updateData = {
      isActive: false,
    };

    it('deve atualizar webhook com sucesso', async () => {
      mockPrismaService.webhook.update.mockResolvedValue({
        ...mockWebhook,
        isActive: false,
      });

      const result = await service.updateWebhook('webhook-1', updateData);

      expect(result).toBeDefined();
      expect(mockPrismaService.webhook.update).toHaveBeenCalledWith({
        where: { id: 'webhook-1' },
        data: updateData,
        include: expect.any(Object),
      });
    });
  });

  describe('deleteWebhook', () => {
    it('deve remover webhook com sucesso', async () => {
      mockPrismaService.webhook.delete.mockResolvedValue({});

      const result = await service.deleteWebhook('webhook-1');

      expect(result).toEqual({ message: 'Webhook removido com sucesso' });
      expect(mockPrismaService.webhook.delete).toHaveBeenCalledWith({
        where: { id: 'webhook-1' },
      });
    });
  });

  describe('processWebhookEvent', () => {
    const webhookEvent: WebhookEventDto = {
      eventType: WebhookEventType.ORDER_CREATED,
      source: WebhookSource.INTERNAL,
      entityId: 'order-1',
      data: { test: 'data' },
    };

    it('deve processar evento e criar entregas', async () => {
      mockPrismaService.webhook.findMany.mockResolvedValue([mockWebhook]);

      // Mock do deliverWebhook para evitar chamadas reais
      const deliverWebhookSpy = jest
        .spyOn(service, 'deliverWebhook')
        .mockResolvedValue(undefined);

      await service.processWebhookEvent(webhookEvent);

      expect(mockPrismaService.webhook.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          events: {
            has: WebhookEventType.ORDER_CREATED,
          },
        },
      });
      expect(deliverWebhookSpy).toHaveBeenCalledWith('webhook-1', webhookEvent);
    });

    it('deve ignorar webhooks inativos', async () => {
      mockPrismaService.webhook.findMany.mockResolvedValue([]);

      await service.processWebhookEvent(webhookEvent);

      expect(mockPrismaService.webhookDelivery.create).not.toHaveBeenCalled();
    });
  });

  describe('deliverWebhook', () => {
    const webhookEvent: WebhookEventDto = {
      eventType: WebhookEventType.ORDER_CREATED,
      source: WebhookSource.INTERNAL,
      entityId: 'order-1',
      data: { test: 'data' },
    };

    it('deve criar entrega para webhook ativo', async () => {
      mockPrismaService.webhook.findUnique.mockResolvedValue(mockWebhook);
      mockPrismaService.webhookDelivery.create.mockResolvedValue(mockDelivery);

      await service.deliverWebhook('webhook-1', webhookEvent);

      expect(mockPrismaService.webhookDelivery.create).toHaveBeenCalled();
    });

    it('deve ignorar webhook inativo', async () => {
      mockPrismaService.webhook.findUnique.mockResolvedValue({
        ...mockWebhook,
        isActive: false,
      });

      await service.deliverWebhook('webhook-1', webhookEvent);

      expect(mockPrismaService.webhookDelivery.create).not.toHaveBeenCalled();
    });

    it('deve ignorar webhook não encontrado', async () => {
      mockPrismaService.webhook.findUnique.mockResolvedValue(null);

      await service.deliverWebhook('webhook-999', webhookEvent);

      expect(mockPrismaService.webhookDelivery.create).not.toHaveBeenCalled();
    });
  });

  describe('retryFailedDeliveries', () => {
    it('deve processar entregas falhadas', async () => {
      const failedDelivery = {
        ...mockDelivery,
        status: DeliveryStatus.FAILED,
        attempts: 2,
        nextRetryAt: new Date(Date.now() - 1000),
      };

      mockPrismaService.webhookDelivery.findMany.mockResolvedValue([
        failedDelivery,
      ]);

      await service.retryFailedDeliveries();

      expect(mockPrismaService.webhookDelivery.findMany).toHaveBeenCalledWith({
        where: {
          status: DeliveryStatus.FAILED,
          attempts: { lt: 5 },
          nextRetryAt: { lte: expect.any(Date) },
        },
        include: { webhook: true },
      });
    });
  });

  describe('getDeliveryStats', () => {
    it('deve retornar estatísticas de entregas', async () => {
      mockPrismaService.webhookDelivery.groupBy.mockResolvedValue([
        { status: DeliveryStatus.DELIVERED, _count: { status: 10 } },
        { status: DeliveryStatus.FAILED, _count: { status: 3 } },
        { status: DeliveryStatus.PENDING, _count: { status: 2 } },
      ]);

      const result = await service.getDeliveryStats();

      expect(result).toEqual({
        total: 15,
        delivered: 10,
        failed: 3,
        pending: 2,
      });
    });
  });

  describe('generateSignature', () => {
    it('deve gerar assinatura HMAC', () => {
      const signature = service['generateSignature'](
        'test-payload',
        'test-secret',
      );

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
    });

    it('deve retornar string vazia quando secret não fornecido', () => {
      const signature = service['generateSignature']('test-payload', '');

      expect(signature).toBe('');
    });
  });
});
