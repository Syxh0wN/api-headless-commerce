# 🚀 Configuração do Insomnia para Headless Commerce API

## 📋 Como Importar o Projeto

### 1. Abrir o Insomnia
- Abra o Insomnia Desktop
- Clique em **"Create"** ou **"+"** para criar um novo projeto

### 2. Importar o Arquivo
- Clique em **"Import"** 
- Selecione **"From File"**
- Escolha o arquivo `insomnia-api-headless-commerce.json`
- Clique em **"Import"**

### 3. Configurar Environment
- Vá para **"Manage Environments"** (ícone de engrenagem)
- Edite o **"Base Environment"**
- Configure as variáveis conforme necessário:

```json
{
  "base_url": "http://localhost:3000",
  "cart_id": "cart-123",
  "item_id": "item-123", 
  "order_id": "order-123",
  "product_id": "product-123",
  "auth_token": "your-jwt-token-here",
  "admin_token": "your-admin-jwt-token-here",
  "api_key": "your-api-key-here",
  "idempotency_key": "req-{{ $timestamp }}"
}
```

## 🎯 Estrutura do Projeto

### 📁 Health Checks
- **Health Check**: `GET /api/health` - Status da API
- **Readiness Check**: `GET /api/ready` - Prontidão da API

### 📁 Products
- **Listar Produtos**: `GET /api/products` - Catálogo de produtos
  - Parâmetros: `page`, `limit`, `search`, `category`, `sortBy`, `sortOrder`

### 📁 Cart
- **Criar Carrinho**: `POST /api/v1/carts` - Novo carrinho guest
- **Adicionar ao Carrinho**: `POST /api/v1/carts/{cartId}/items`
- **Obter Carrinho**: `GET /api/v1/carts/{cartId}` - Carrinho com totais
- **Atualizar Item**: `PATCH /api/v1/carts/{cartId}/items/{itemId}`
- **Remover Item**: `DELETE /api/v1/carts/{cartId}/items/{itemId}`
- **Aplicar Promoção**: `POST /api/v1/carts/{cartId}/apply-promo`

### 📁 Checkout
- **Criar Pedido**: `POST /api/v1/checkout` - Processar checkout
- **Obter Pedido**: `GET /api/v1/checkout/orders/{orderId}`
- **Listar Pedidos**: `GET /api/v1/checkout/orders`

### 📁 Admin (RBAC)
- **Criar Produto**: `POST /api/v1/admin/products`
- **Atualizar Produto**: `PATCH /api/v1/admin/products/{productId}`
- **Criar Código Promocional**: `POST /api/v1/admin/promo-codes`
- **Listar Pedidos (Admin)**: `GET /api/v1/admin/orders`

### 📁 Webhooks
- **Testar Webhook**: `POST /api/v1/webhooks/{provider}`

## 🔧 Variáveis de Ambiente

### Variáveis Obrigatórias
- `base_url`: URL base da API (padrão: `http://localhost:3000`)

### Variáveis para Testes
- `cart_id`: ID do carrinho para testes
- `item_id`: ID do item para testes
- `order_id`: ID do pedido para testes
- `product_id`: ID do produto para testes

### Variáveis de Autenticação
- `auth_token`: JWT token para usuários autenticados
- `admin_token`: JWT token para administradores
- `api_key`: API key para webhooks

### Variáveis Automáticas
- `idempotency_key`: Chave de idempotência (gerada automaticamente)

## 🧪 Fluxo de Teste Recomendado

### 1. Verificar Saúde da API
```
GET /api/health
GET /api/ready
```

### 2. Testar Catálogo
```
GET /api/products
```

### 3. Fluxo de Carrinho
```
POST /api/v1/carts                    # Criar carrinho
POST /api/v1/carts/{cartId}/items     # Adicionar item
GET /api/v1/carts/{cartId}            # Ver carrinho
PATCH /api/v1/carts/{cartId}/items/{itemId}  # Atualizar item
POST /api/v1/carts/{cartId}/apply-promo      # Aplicar promoção
```

### 4. Fluxo de Checkout
```
POST /api/v1/checkout                 # Criar pedido
GET /api/v1/checkout/orders/{orderId} # Ver pedido
GET /api/v1/checkout/orders           # Listar pedidos
```

### 5. Testes Admin (se autenticado)
```
POST /api/v1/admin/products           # Criar produto
PATCH /api/v1/admin/products/{productId} # Atualizar produto
POST /api/v1/admin/promo-codes        # Criar promoção
GET /api/v1/admin/orders              # Listar pedidos
```

## 🔐 Autenticação

### JWT Token
Para endpoints que requerem autenticação, adicione o header:
```
Authorization: Bearer {auth_token}
```

### API Key
Para webhooks, adicione o header:
```
X-API-Key: {api_key}
```

## 📝 Exemplos de Payload

### Criar Item no Carrinho
```json
{
  "productId": "product-1",
  "quantity": 2
}
```

### Criar Pedido
```json
{
  "cartId": "cart-123",
  "paymentMethod": "CREDIT_CARD",
  "shippingAddress": {
    "street": "Rua das Flores, 123",
    "number": "123",
    "complement": "Apto 1",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "country": "BR"
  },
  "notes": "Pedido de teste"
}
```

### Criar Produto (Admin)
```json
{
  "title": "Produto Teste",
  "slug": "produto-teste",
  "sku": "SKU123",
  "description": "Descrição do produto teste",
  "price": 9999,
  "categoryId": "cat-1",
  "tags": ["teste", "produto"],
  "isActive": true
}
```

## 🚨 Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o token JWT está correto
- Confirme se o token não expirou

### Erro 403 (Forbidden)
- Verifique se o usuário tem permissão (RBAC)
- Use token de admin para endpoints administrativos

### Erro 404 (Not Found)
- Verifique se a API está rodando
- Confirme se a URL base está correta

### Erro 500 (Internal Server Error)
- Verifique os logs da API
- Confirme se o banco de dados está conectado

## 📚 Documentação Adicional

- **Swagger UI**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/api/health`
- **Readiness Check**: `http://localhost:3000/api/ready`

## 🎉 Pronto para Usar!

Agora você pode testar toda a API Headless Commerce diretamente no Insomnia! 🚀
