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
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cart.findUnique.mockResolvedValue(null);
      mockPrismaService.cart.create.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue({});

      const result = await service.addToCart('user-1', addToCartDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-1' },
      });
      expect(mockPrismaService.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 2,
          price: 9999,
        },
      });
    });

    it('deve lançar NotFoundException quando produto não encontrado', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.addToCart('user-1', addToCartDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar BadRequestException quando produto não está ativo', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue({
        ...mockProduct,
        isActive: false,
      });

      await expect(service.addToCart('user-1', addToCartDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve atualizar quantidade quando item já existe no carrinho', async () => {
      const existingItem = {
        id: 'item-1',
        quantity: 1,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(existingItem);
      mockPrismaService.cartItem.update.mockResolvedValue({});

      await service.addToCart('user-1', addToCartDto);

      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 3 },
      });
    });
  });

  describe('getCart', () => {
    it('deve retornar carrinho com itens e totais', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);

      const result = await service.getCart('user-1');

      expect(result).toEqual({
        id: 'cart-1',
        userId: 'user-1',
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
        totalItems: 2,
        totalPrice: 19998,
        createdAt: mockCart.createdAt,
        updatedAt: mockCart.updatedAt,
      });
    });

    it('deve retornar carrinho vazio quando não encontrado', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      const result = await service.getCart('user-1');

      expect(result).toEqual({
        id: '',
        userId: 'user-1',
        items: [],
        totalItems: 0,
        totalPrice: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateCartItem', () => {
    const updateDto = { quantity: 5 };

    it('deve atualizar quantidade do item com sucesso', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
      });
      mockPrismaService.cartItem.update.mockResolvedValue({});

      const result = await service.updateCartItem('user-1', 'item-1', updateDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      });
    });

    it('deve lançar NotFoundException quando carrinho não encontrado', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      await expect(
        service.updateCartItem('user-1', 'item-1', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar NotFoundException quando item não encontrado', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCartItem('user-1', 'item-1', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromCart', () => {
    it('deve remover item do carrinho com sucesso', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
      });
      mockPrismaService.cartItem.delete.mockResolvedValue({});

      const result = await service.removeFromCart('user-1', 'item-1');

      expect(result).toBeDefined();
      expect(mockPrismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
    });

    it('deve lançar NotFoundException quando carrinho não encontrado', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      await expect(
        service.removeFromCart('user-1', 'item-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar NotFoundException quando item não encontrado', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(
        service.removeFromCart('user-1', 'item-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('clearCart', () => {
    it('deve limpar carrinho com sucesso', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({});

      const result = await service.clearCart('user-1');

      expect(result).toEqual({ message: 'Carrinho limpo com sucesso' });
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' },
      });
    });

    it('deve lançar NotFoundException quando carrinho não encontrado', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      await expect(service.clearCart('user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
