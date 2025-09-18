import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { AdminService } from './admin.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@ApiTags('Admin v1')
@ApiBearerAuth()
@Controller('v1/admin')
@UseGuards(AdminGuard)
@UseInterceptors(AuditInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ===== PRODUTOS =====
  @Post('products')
  @ApiOperation({ summary: 'Criar produto (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.adminService.createProduct(createProductDto);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Atualizar produto (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.adminService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Remover produto (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 204, description: 'Produto removido com sucesso' })
  async removeProduct(@Param('id') id: string) {
    await this.adminService.removeProduct(id);
  }

  // ===== VARIANTES =====
  @Post('products/:id/variants')
  @ApiOperation({ summary: 'Criar variante de produto (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 201, description: 'Variante criada com sucesso' })
  async createVariant(
    @Param('id') productId: string,
    @Body() createVariantDto: any,
  ) {
    return this.adminService.createVariant(productId, createVariantDto);
  }

  @Patch('variants/:id/stock')
  @ApiOperation({ summary: 'Atualizar estoque da variante (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 200, description: 'Estoque atualizado com sucesso' })
  async updateStock(
    @Param('id') variantId: string,
    @Body() stockDto: { quantity: number },
  ) {
    return this.adminService.updateStock(variantId, stockDto.quantity);
  }

  // ===== PROMO CODES =====
  @Post('promo-codes')
  @ApiOperation({ summary: 'Criar código promocional (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 201, description: 'Código promocional criado com sucesso' })
  async createPromoCode(@Body() createCouponDto: CreateCouponDto) {
    return this.adminService.createPromoCode(createCouponDto);
  }

  @Patch('promo-codes/:id')
  @ApiOperation({ summary: 'Atualizar código promocional (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 200, description: 'Código promocional atualizado com sucesso' })
  async updatePromoCode(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.adminService.updatePromoCode(id, updateCouponDto);
  }

  @Delete('promo-codes/:id')
  @ApiOperation({ summary: 'Remover código promocional (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 204, description: 'Código promocional removido com sucesso' })
  async removePromoCode(@Param('id') id: string) {
    await this.adminService.removePromoCode(id);
  }

  // ===== PEDIDOS =====
  @Get('orders')
  @ApiOperation({ summary: 'Listar todos os pedidos (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  async listOrders() {
    return this.adminService.listOrders();
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido (RBAC: ADMIN/STAFF)' })
  @ApiResponse({ status: 200, description: 'Status do pedido atualizado' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: string },
  ) {
    return this.adminService.updateOrderStatus(id, statusDto.status);
  }

  // ===== API KEYS =====
  @Post('api-keys')
  @ApiOperation({ summary: 'Gerar nova API Key (RBAC: ADMIN)' })
  @ApiResponse({ status: 201, description: 'API Key gerada com sucesso' })
  async generateApiKey(@Body() keyDto: { role: string; expiresAt?: string }) {
    return this.adminService.generateApiKey(keyDto.role, keyDto.expiresAt);
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'Listar API Keys (RBAC: ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de API Keys' })
  async listApiKeys() {
    return this.adminService.listApiKeys();
  }

  // ===== AUDIT LOGS =====
  @Get('audit-logs')
  @ApiOperation({ summary: 'Visualizar logs de auditoria (RBAC: ADMIN)' })
  @ApiResponse({ status: 200, description: 'Logs de auditoria' })
  async getAuditLogs(
    @Param('entity') entity?: string,
    @Param('entityId') entityId?: string,
  ) {
    return this.adminService.getAuditLogs(entity, entityId);
  }
}
