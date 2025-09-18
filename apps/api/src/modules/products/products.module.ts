import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsV1Controller } from './products-v1.controller';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Module({
  controllers: [ProductsController, ProductsV1Controller],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
