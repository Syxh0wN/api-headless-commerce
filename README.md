# API Headless Commerce

API de Catálogo + Carrinho (Headless Commerce) em Node + TypeScript (NestJS).

## Estrutura do Projeto

```
apps/api/src/
├── main.ts                    # Ponto de entrada da aplicação
├── app.module.ts             # Módulo principal
├── app.controller.ts         # Controller principal
├── app.service.ts           # Service principal
├── common/                  # Módulos comuns
│   ├── config/              # Configuração com Zod
│   ├── guards/              # Guards de autenticação
│   ├── interceptors/        # Interceptors de logging
│   ├── filters/             # Filtros de exceção
│   └── utils/               # Utilitários (Result, Money, IDs)
├── infra/                   # Infraestrutura
│   ├── prisma/              # Serviço do Prisma
│   ├── redis/               # Serviço do Redis
│   ├── queue/               # BullMQ
│   └── telemetry/           # OpenTelemetry
└── modules/                 # Módulos de negócio
    ├── auth/                # Autenticação
    ├── products/            # Catálogo de produtos
    ├── cart/                # Carrinho de compras
    ├── checkout/            # Checkout e pedidos
    ├── webhook/             # Webhooks
    ├── search/              # Busca (Meilisearch)
    └── admin/               # Painel administrativo
```

## Tecnologias

- **Framework**: NestJS + TypeScript
- **Banco de dados**: PostgreSQL + Prisma
- **Cache**: Redis
- **Filas**: BullMQ
- **Autenticação**: JWT + RBAC
- **Validação**: Zod + class-validator
- **Documentação**: Swagger
- **Testes**: Jest + Supertest
- **Observabilidade**: OpenTelemetry

## Fluxo de Branches

- **main**: Branch principal para desenvolvimento
- **production**: Branch de produção (deploy automático)

### Regras de Workflow

1. **Desenvolvimento**: Sempre trabalhar na branch `main`
2. **Deploy**: Merge de `main` para `production` via Pull Request
3. **Commits**: Usar conventional commits (feat:, fix:, docs:, etc.)
4. **Commits pequenos**: Fazer commits frequentes e pequenos

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Testes
npm run test
npm run test:e2e

# Lint
npm run lint
```

## Configuração

1. Copie o arquivo `env.example` para `.env`
2. Configure as variáveis de ambiente
3. Execute as migrações do Prisma
4. Inicie o servidor de desenvolvimento

## API Endpoints

- **Health Check**: `GET /`
- **Documentação**: `GET /api/docs`
- **Produtos**: `GET /products`
- **Carrinho**: `GET /cart`
- **Checkout**: `POST /checkout`

## Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request