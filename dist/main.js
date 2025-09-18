"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./infra/prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Headless Commerce API')
        .setDescription('API de Catálogo + Carrinho para E-commerce Headless')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const prismaService = app.get(prisma_service_1.PrismaService);
    await prismaService.$connect();
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`API rodando em http://localhost:${port}`);
    console.log(`Documentacao em http://localhost:${port}/api/docs`);
    console.log(`Health check em http://localhost:${port}/api/health`);
}
void bootstrap();
//# sourceMappingURL=main.js.map