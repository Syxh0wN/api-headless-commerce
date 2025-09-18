import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartV1Controller } from './cart-v1.controller';
import { GuestCartController } from './guest-cart.controller';
import { CartService } from './cart.service';
import { GuestCartService } from './guest-cart.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CartController, CartV1Controller, GuestCartController],
  providers: [CartService, GuestCartService, PrismaService],
  exports: [CartService, GuestCartService],
})
export class CartModule {}
