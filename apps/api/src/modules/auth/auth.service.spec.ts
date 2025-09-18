import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@email.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: 'CUSTOMER',
    createdAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@email.com',
      name: 'Test User',
      password: 'password123',
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: 'test@email.com',
        name: 'Test User',
        role: 'CUSTOMER',
        createdAt: new Date(),
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@email.com');
      expect(result.token).toBe('jwt-token');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('deve lançar ConflictException quando email já existe', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@email.com',
      password: 'password123',
    };

    const registerDto = {
      email: 'test@email.com',
      name: 'Test User',
      password: 'password123',
    };

    it('deve fazer login com sucesso', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@email.com');
      expect(result.token).toBe('jwt-token');
    });

    it('deve lançar UnauthorizedException quando usuário não existe', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve lançar UnauthorizedException quando senha está incorreta', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
