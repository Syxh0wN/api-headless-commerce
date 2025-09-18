import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../apps/api/src/app.module';
import { PrismaService } from '../apps/api/src/infra/prisma/prisma.service';

describe('Cart to Checkout E2E Flow', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;
  let productId: string;
  let cartId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
  });

  describe('Complete E2E Flow', () => {
    it('should complete full cart to checkout flow', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const productData = {
        name: 'Test Product',
        slug: 'test-product',
        sku: 'TEST-001',
        price: 10000,
        description: 'Test product description',
        categoryId: null,
        isActive: true,
        tags: ['test'],
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      authToken = registerResponse.body.accessToken;
      userId = registerResponse.body.user.id;

      const productResponse = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201);

      productId = productResponse.body.id;

      const addToCartResponse = await request(app.getHttpServer())
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          quantity: 2,
        })
        .expect(201);

      cartId = addToCartResponse.body.id;

      const cartResponse = await request(app.getHttpServer())
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(cartResponse.body.items).toHaveLength(1);
      expect(cartResponse.body.totalItems).toBe(2);
      expect(cartResponse.body.totalPrice).toBe(20000);

      const checkoutData = {
        cartId,
        shippingAddress: {
          street: 'Rua Teste, 123',
          complement: 'Apto 45',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil',
        },
        paymentMethod: 'CREDIT_CARD',
        notes: 'Test order',
      };

      const orderResponse = await request(app.getHttpServer())
        .post('/api/checkout/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData)
        .expect(201);

      expect(orderResponse.body.orderNumber).toBeDefined();
      expect(orderResponse.body.status).toBe('PENDING');
      expect(orderResponse.body.total).toBeGreaterThan(0);
      expect(orderResponse.body.items).toHaveLength(1);

      const ordersResponse = await request(app.getHttpServer())
        .get('/api/checkout/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(ordersResponse.body).toHaveLength(1);
      expect(ordersResponse.body[0].id).toBe(orderResponse.body.id);

      const cartAfterCheckout = await request(app.getHttpServer())
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(cartAfterCheckout.body.items).toHaveLength(0);
    });

    it('should handle cart operations correctly', async () => {
      const userData = {
        email: 'test2@example.com',
        name: 'Test User 2',
        password: 'password123',
      };

      const productData = {
        name: 'Test Product 2',
        slug: 'test-product-2',
        sku: 'TEST-002',
        price: 5000,
        description: 'Test product 2 description',
        categoryId: null,
        isActive: true,
        tags: ['test'],
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(201);

      authToken = loginResponse.body.accessToken;

      const productResponse = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201);

      productId = productResponse.body.id;

      await request(app.getHttpServer())
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId,
          quantity: 3,
        })
        .expect(201);

      const cartResponse = await request(app.getHttpServer())
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const itemId = cartResponse.body.items[0].id;

      await request(app.getHttpServer())
        .patch(`/api/cart/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 5 })
        .expect(200);

      const updatedCart = await request(app.getHttpServer())
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(updatedCart.body.items[0].quantity).toBe(5);
      expect(updatedCart.body.totalItems).toBe(5);

      await request(app.getHttpServer())
        .delete(`/api/cart/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const emptyCart = await request(app.getHttpServer())
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(emptyCart.body.items).toHaveLength(0);
    });

    it('should handle authentication correctly', async () => {
      await request(app.getHttpServer())
        .get('/api/cart')
        .expect(401);

      await request(app.getHttpServer())
        .post('/api/cart/add')
        .send({ productId: 'test', quantity: 1 })
        .expect(401);

      await request(app.getHttpServer())
        .post('/api/checkout/orders')
        .send({})
        .expect(401);
    });

    it('should validate product data correctly', async () => {
      const userData = {
        email: 'test3@example.com',
        name: 'Test User 3',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(201);

      authToken = loginResponse.body.accessToken;

      await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
          price: -100,
        })
        .expect(400);

      await request(app.getHttpServer())
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'invalid-id',
          quantity: 0,
        })
        .expect(400);
    });
  });
});
