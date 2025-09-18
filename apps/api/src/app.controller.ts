import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check da API' })
  @ApiResponse({ status: 200, description: 'API funcionando corretamente' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Status detalhado da API' })
  @ApiResponse({ status: 200, description: 'Status completo da aplicação' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check da API' })
  @ApiResponse({ status: 200, description: 'Status de prontidão da aplicação' })
  getReadiness() {
    return this.appService.getReadiness();
  }
}
