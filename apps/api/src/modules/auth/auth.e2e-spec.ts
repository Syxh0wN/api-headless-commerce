import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infra/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prismaService.cleanDatabase();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('deve registrar um novo usuário', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@email.com',
          name: 'Test User',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
          expect(res.body.user.email).toBe('test@email.com');
          expect(res.body.user.name).toBe('Test User');
        });
    });

    it('deve retornar erro 409 quando email já existe', async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test@email.com',
        name: 'Test User',
        password: 'password123',
      });

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@email.com',
          name: 'Another User',
          password: 'password456',
        })
        .expect(409);
    });

    it('deve retornar erro 400 quando dados inválidos', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          name: 'T',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'login@email.com',
        name: 'Login User',
        password: 'password123',
      });
    });

    it('deve fazer login com sucesso', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login@email.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
          expect(res.body.user.email).toBe('login@email.com');
        });
    });

    it('deve retornar erro 401 quando credenciais inválidas', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login@email.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('deve retornar erro 401 quando usuário não existe', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@email.com',
          password: 'password123',
        })
        .expect(401);
    });
  });
});
