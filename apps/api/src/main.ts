// import './infra/telemetry/tracing';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './infra/prisma/prisma.service';
import { RedisService } from './infra/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Headless Commerce API')
    .setDescription('API de Catálogo + Carrinho para E-commerce Headless')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const prismaService = app.get(PrismaService);

  await prismaService.$connect();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`API rodando em http://localhost:${port}`);
  console.log(`Documentacao em http://localhost:${port}/api/docs`);
  console.log(`Health check em http://localhost:${port}/api/health`);
}

void bootstrap();
