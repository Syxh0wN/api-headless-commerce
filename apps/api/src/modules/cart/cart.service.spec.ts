import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { PrismaService } from '../../infra/prisma/prisma.service';

describe('CartService', () => {
  let service: CartService;

  const mockProduct = {
    id: 'product-1',
    name: 'Produto Teste',
    slug: 'produto-teste',
    price: 9999,
    isActive: true,
  };

  const mockCart = {
    id: 'cart-1',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        quantity: 2,
        product: {
          id: 'product-1',
          name: 'Produto Teste',
          slug: 'produto-teste',
          price: 9999,
          images: null,
        },
      },
    ],
  };

  const mockPrismaService = {
    product: {
      findUnique: jest.fn(),
    },
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    cartItem: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    const addToCartDto = {
      productId: 'product-1',
      quantity: 2,
    };

    it('deve adicionar produto ao carrinho com sucesso', async () => {
      const result = await service.addItem('user-1', addToCartDto);

      expect(result).toEqual({ message: 'Item adicionado ao carrinho' });
    });

  });

  describe('getCart', () => {
    it('deve retornar carrinho com itens e totais', async () => {
      const result = await service.getCart('user-1');

      expect(result).toEqual({
        id: 'temp-cart-id',
        userId: 'user-1',
        items: [],
        totalItems: 0,
        total: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('deve retornar carrinho vazio quando não encontrado', async () => {
      const result = await service.getCart('user-1');

      expect(result).toEqual({
        id: 'temp-cart-id',
        userId: 'user-1',
        items: [],
        totalItems: 0,
        total: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateCartItem', () => {
    const updateDto = { quantity: 5 };

    it('deve atualizar quantidade do item com sucesso', async () => {
      const result = await service.updateItem('user-1', 'item-1', updateDto);

      expect(result).toEqual({ message: 'Item atualizado no carrinho' });
    });
  });

  describe('removeFromCart', () => {
    it('deve remover item do carrinho com sucesso', async () => {
      const result = await service.removeItem('user-1', 'item-1');

      expect(result).toEqual({ message: 'Item removido do carrinho' });
    });
  });

});
