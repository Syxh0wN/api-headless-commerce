import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { CacheInterceptor } from '../../common/interceptors/cache.interceptor';

@ApiTags('Products v1')
@Controller('v1/products')
export class ProductsV1Controller {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar produtos com cache e ETag' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  @ApiResponse({ status: 304, description: 'Não modificado (ETag)' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Buscar produto por slug com cache' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 304, description: 'Não modificado (ETag)' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
