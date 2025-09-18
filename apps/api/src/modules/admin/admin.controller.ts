import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('products')
  @ApiOperation({ summary: 'Listar todos os produtos (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async getAllProducts(@Query() query: any) {
    return this.adminService.getAllProducts(query);
  }

  @Post('products')
  @ApiOperation({ summary: 'Criar produto (Admin)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.adminService.createProduct(createProductDto);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Atualizar produto (Admin)' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.adminService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Deletar produto (Admin)' })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Get('products/:id/variants')
  @ApiOperation({ summary: 'Listar variantes do produto (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de variantes' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async getProductVariants(@Param('id') productId: string) {
    return this.adminService.getProductVariants(productId);
  }

  @Post('products/:id/variants')
  @ApiOperation({ summary: 'Criar variante do produto (Admin)' })
  @ApiResponse({ status: 201, description: 'Variante criada com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async createProductVariant(
    @Param('id') productId: string,
    @Body() variantData: any,
  ) {
    return this.adminService.createProductVariant(productId, variantData);
  }

  @Patch('variants/:id/inventory')
  @ApiOperation({ summary: 'Atualizar estoque da variante (Admin)' })
  @ApiResponse({ status: 200, description: 'Estoque atualizado com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async updateInventory(
    @Param('id') variantId: string,
    @Body() inventoryData: any,
  ) {
    return this.adminService.updateInventory(variantId, inventoryData);
  }

  @Get('coupons')
  @ApiOperation({ summary: 'Listar cupons promocionais (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de cupons' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async getCoupons() {
    return this.adminService.getCoupons();
  }

  @Post('coupons')
  @ApiOperation({ summary: 'Criar cupom promocional (Admin)' })
  @ApiResponse({ status: 201, description: 'Cupom criado com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.adminService.createCoupon(createCouponDto);
  }

  @Patch('coupons/:id')
  @ApiOperation({ summary: 'Atualizar cupom promocional (Admin)' })
  @ApiResponse({ status: 200, description: 'Cupom atualizado com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async updateCoupon(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.adminService.updateCoupon(id, updateCouponDto);
  }

  @Delete('coupons/:id')
  @ApiOperation({ summary: 'Deletar cupom promocional (Admin)' })
  @ApiResponse({ status: 200, description: 'Cupom deletado com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async deleteCoupon(@Param('id') id: string) {
    return this.adminService.deleteCoupon(id);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Listar todos os pedidos (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async getAllOrders(@Query() query: any) {
    return this.adminService.getAllOrders(query);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido (Admin)' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() statusData: any,
  ) {
    return this.adminService.updateOrderStatus(id, statusData);
  }
}
