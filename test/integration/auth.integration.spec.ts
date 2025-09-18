import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
import { AppModule } from '../../apps/api/src/app.module';
import { PrismaService } from '../../apps/api/src/infra/prisma/prisma.service';
import { RedisService } from '../../apps/api/src/infra/redis/redis.service';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: RedisService;
  let postgresContainer: PostgreSqlContainer;
  let redisContainer: RedisContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .start();

    redisContainer = await new RedisContainer('redis:7-alpine').start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        user: {
          findUnique: jest.fn(),
          create: jest.fn(),
        },
      })
      .overrideProvider(RedisService)
      .useValue({
        connect: jest.fn(),
        ping: jest.fn().mockResolvedValue('PONG'),
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    redis = moduleFixture.get<RedisService>(RedisService);
  });

  afterAll(async () => {
    await app.close();
    await postgresContainer.stop();
    await redisContainer.stop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-1',
        email: userData.email,
        name: userData.name,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
    });

    it('should return 400 if user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
      };

      const existingUser = {
        id: 'user-1',
        email: userData.email,
        name: userData.name,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(existingUser);

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        name: '',
        password: '123',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-1',
        email: loginData.email,
        name: 'Test User',
        password: '$2a$10$hashedpassword',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginData)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Redis Integration', () => {
    it('should connect to Redis successfully', async () => {
      await redis.connect();
      const pingResult = await redis.ping();
      expect(pingResult).toBe('PONG');
    });

    it('should store and retrieve data from Redis', async () => {
      const testKey = 'test:key';
      const testValue = 'test:value';

      await redis.set(testKey, testValue);
      const retrievedValue = await redis.get(testKey);
      expect(retrievedValue).toBe(testValue);
    });
  });
});
