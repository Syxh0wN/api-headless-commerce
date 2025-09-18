import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'headless_commerce_',
        },
      },
      path: '/metrics',
      defaultLabels: {
        app: 'headless-commerce-api',
        version: '1.0.0',
      },
    }),
  ],
  exports: [PrometheusModule],
})
export class ObservabilityModule {}
