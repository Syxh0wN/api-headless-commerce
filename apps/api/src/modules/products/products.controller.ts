import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos do catálogo' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }
}
