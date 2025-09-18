import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import * as crypto from 'crypto';

export interface WebhookEventData {
  externalId: string;
  signature: string;
  payload: any;
  provider: string;
}

@Injectable()
export class WebhookEventService {
  constructor(private prisma: PrismaService) {}

  async processWebhookEvent(
    provider: string,
    eventData: WebhookEventData,
  ): Promise<{ processed: boolean; eventId?: string }> {
    // 1. Verificar se o evento já foi processado (dedupe)
    const existingEvent = await this.prisma.webhookEvent.findUnique({
      where: { externalId: eventData.externalId },
    });

    if (existingEvent) {
      if (existingEvent.processedAt) {
        // Evento já processado, retornar sucesso
        return { processed: true, eventId: existingEvent.id };
      } else {
        // Evento existe mas não foi processado, pode ser um retry
        throw new ConflictException('Evento já existe mas não foi processado');
      }
    }

    // 2. Validar assinatura HMAC
    const isValidSignature = this.validateSignature(
      eventData.signature,
      eventData.payload,
      provider,
    );

    if (!isValidSignature) {
      throw new BadRequestException('Assinatura HMAC inválida');
    }

    // 3. Criar evento
    const event = await this.prisma.webhookEvent.create({
      data: {
        externalId: eventData.externalId,
        signature: eventData.signature,
        payload: eventData.payload,
      },
    });

    // 4. Processar evento (lógica específica por provider)
    try {
      await this.processEventByProvider(provider, eventData.payload);
      
      // 5. Marcar como processado
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { processedAt: new Date() },
      });

      return { processed: true, eventId: event.id };
    } catch (error) {
      // Em caso de erro, manter o evento não processado para retry
      console.error(`Erro ao processar webhook ${provider}:`, error);
      throw error;
    }
  }

  private validateSignature(signature: string, payload: any, provider: string): boolean {
    // Em produção, usar a chave secreta específica do provider
    const secret = this.getProviderSecret(provider);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  private getProviderSecret(provider: string): string {
    // Em produção, buscar do banco de dados ou variáveis de ambiente
    const secrets: Record<string, string> = {
      stripe: process.env.STRIPE_WEBHOOK_SECRET || 'stripe_secret',
      pagseguro: process.env.PAGSEGURO_WEBHOOK_SECRET || 'pagseguro_secret',
      mock: 'mock_secret',
    };

    return secrets[provider] || 'default_secret';
  }

  private async processEventByProvider(provider: string, payload: any): Promise<void> {
    switch (provider) {
      case 'stripe':
        await this.processStripeEvent(payload);
        break;
      case 'pagseguro':
        await this.processPagSeguroEvent(payload);
        break;
      case 'mock':
        await this.processMockEvent(payload);
        break;
      default:
        throw new BadRequestException(`Provider ${provider} não suportado`);
    }
  }

  private async processStripeEvent(payload: any): Promise<void> {
    // Implementar lógica específica do Stripe
    console.log('Processando evento Stripe:', payload.type);
    
    switch (payload.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(payload.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(payload.data.object);
        break;
      default:
        console.log(`Evento Stripe não tratado: ${payload.type}`);
    }
  }

  private async processPagSeguroEvent(payload: any): Promise<void> {
    // Implementar lógica específica do PagSeguro
    console.log('Processando evento PagSeguro:', payload.eventType);
  }

  private async processMockEvent(payload: any): Promise<void> {
    // Implementar lógica para testes
    console.log('Processando evento Mock:', payload);
  }

  private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
    // Atualizar status do pagamento no banco
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      });

      // Atualizar status do pedido
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' },
      });
    }
  }

  private async handlePaymentFailure(paymentIntent: any): Promise<void> {
    // Atualizar status do pagamento no banco
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      // Atualizar status do pedido
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CANCELLED' },
      });
    }
  }

  async getWebhookEvents(
    limit: number = 100,
    offset: number = 0,
  ): Promise<any[]> {
    return this.prisma.webhookEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getWebhookEventById(id: string): Promise<any> {
    return this.prisma.webhookEvent.findUnique({
      where: { id },
    });
  }
}
