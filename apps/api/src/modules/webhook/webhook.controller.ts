import {
  Controller,
  Post,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { WebhookEventService } from './webhook-event.service';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@ApiTags('Webhooks v1')
@Controller('v1/webhooks')
@UseGuards(ApiKeyGuard)
export class WebhookController {
  constructor(private readonly webhookEventService: WebhookEventService) {}

  @Post(':provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Processar webhook de provider específico' })
  @ApiResponse({ status: 200, description: 'Webhook processado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Evento duplicado' })
  @ApiHeader({ name: 'X-Signature', description: 'Assinatura HMAC do webhook' })
  @ApiHeader({ name: 'X-External-ID', description: 'ID externo do evento' })
  async processWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
    @Headers('x-signature') signature: string,
    @Headers('x-external-id') externalId: string,
  ) {
    if (!signature || !externalId) {
      throw new Error('Headers X-Signature e X-External-ID são obrigatórios');
    }

    const result = await this.webhookEventService.processWebhookEvent(provider, {
      externalId,
      signature,
      payload,
      provider,
    });

    return {
      success: true,
      processed: result.processed,
      eventId: result.eventId,
      message: 'Webhook processado com sucesso',
    };
  }

  @Post(':provider/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Testar webhook (apenas para desenvolvimento)' })
  @ApiResponse({ status: 200, description: 'Webhook de teste processado' })
  async testWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
  ) {
    const testExternalId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const testSignature = 'test_signature';

    const result = await this.webhookEventService.processWebhookEvent(provider, {
      externalId: testExternalId,
      signature: testSignature,
      payload,
      provider,
    });

    return {
      success: true,
      processed: result.processed,
      eventId: result.eventId,
      message: 'Webhook de teste processado com sucesso',
    };
  }
}
