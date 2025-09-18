import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutV1Controller } from './checkout-v1.controller';
import { CheckoutService } from './checkout.service';
import { AtomicCheckoutService } from './atomic-checkout.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { RedisService } from '../../infra/redis/redis.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CheckoutController, CheckoutV1Controller],
  providers: [CheckoutService, AtomicCheckoutService, PrismaService, RedisService],
  exports: [CheckoutService, AtomicCheckoutService],
})
export class CheckoutModule {}
