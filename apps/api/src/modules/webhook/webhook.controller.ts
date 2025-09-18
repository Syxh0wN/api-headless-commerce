import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { WebhookResponseDto } from './dto/webhook-response.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Processar evento de webhook' })
  @ApiResponse({ status: 200, description: 'Evento processado com sucesso' })
  async processEvent(@Body() webhookEventDto: WebhookEventDto): Promise<{ message: string }> {
    await this.webhookService.processWebhookEvent(webhookEventDto);
    return { message: 'Evento processado com sucesso' };
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo webhook' })
  @ApiResponse({ status: 201, description: 'Webhook criado com sucesso' })
  async createWebhook(@Body() createWebhookDto: CreateWebhookDto): Promise<WebhookResponseDto> {
    return this.webhookService.createWebhook(createWebhookDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar webhooks' })
  @ApiResponse({ status: 200, description: 'Lista de webhooks obtida com sucesso' })
  async getWebhooks(): Promise<WebhookResponseDto[]> {
    return this.webhookService.getWebhooks();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter webhook por ID' })
  @ApiResponse({ status: 200, description: 'Webhook obtido com sucesso' })
  async getWebhook(@Param('id') id: string): Promise<WebhookResponseDto> {
    return this.webhookService.getWebhook(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar webhook' })
  @ApiResponse({ status: 200, description: 'Webhook atualizado com sucesso' })
  async updateWebhook(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateWebhookDto>,
  ): Promise<WebhookResponseDto> {
    return this.webhookService.updateWebhook(id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover webhook' })
  @ApiResponse({ status: 200, description: 'Webhook removido com sucesso' })
  async deleteWebhook(@Param('id') id: string): Promise<{ message: string }> {
    return this.webhookService.deleteWebhook(id);
  }

  @Post('retry-failed')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tentar novamente entregas falhadas' })
  @ApiResponse({ status: 200, description: 'Tentativas de entrega iniciadas' })
  async retryFailedDeliveries(): Promise<{ message: string }> {
    await this.webhookService.retryFailedDeliveries();
    return { message: 'Tentativas de entrega iniciadas' };
  }

  @Get('stats/deliveries')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter estatísticas de entregas' })
  @ApiResponse({ status: 200, description: 'Estatísticas obtidas com sucesso' })
  async getDeliveryStats(): Promise<{
    total: number;
    delivered: number;
    failed: number;
    pending: number;
  }> {
    return this.webhookService.getDeliveryStats();
  }
}
