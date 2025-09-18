import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateOrderDto, PaymentMethod } from './dto/create-order.dto';
import { OrderStatus, PaymentStatus } from './dto/update-order-status.dto';

describe('CheckoutService', () => {
  let service: CheckoutService;

  const mockCart = {
    id: 'cart-1',
    userId: 'user-1',
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        variantId: null,
        quantity: 2,
        price: 9999,
        product: {
          id: 'product-1',
          name: 'Produto Teste',
          slug: 'produto-teste',
          price: 9999,
          images: null,
          isActive: true,
        },
      },
    ],
  };

  const mockOrder = {
    id: 'order-1',
    orderNumber: 'ORD-123456',
    userId: 'user-1',
    status: OrderStatus.PENDING,
    subtotal: 19998,
    shippingAmount: 1500,
    taxAmount: 1999,
    discountAmount: 0,
    total: 23497,
    notes: 'Teste',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      {
        id: 'order-item-1',
        productId: 'product-1',
        variantId: null,
        quantity: 2,
        price: 9999,
        total: 19998,
        product: {
          id: 'product-1',
          name: 'Produto Teste',
          slug: 'produto-teste',
          images: null,
        },
      },
    ],
    shipping: {
      firstName: 'João',
      lastName: 'Silva',
      address1: 'Rua Teste, 123',
      address2: 'Apto 1',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'BR',
    },
    payment: {
      method: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
    },
  };

  const mockCoupon = {
    id: 'coupon-1',
    code: 'DESCONTO10',
    type: 'PERCENTAGE',
    value: 10,
    isActive: true,
    startsAt: new Date('2024-01-01'),
    expiresAt: new Date('2024-12-31'),
  };

  const mockPrismaService = {
    cart: {
      findUnique: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    coupon: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    const createOrderDto: CreateOrderDto = {
      paymentMethod: PaymentMethod.CREDIT_CARD,
      shippingAddress: {
        street: 'Rua Teste, 123',
        number: '123',
        complement: 'Apto 1',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'BR',
      },
      notes: 'Teste',
    };

    it('deve criar pedido com sucesso', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({});

      const result = await service.createOrder('user-1', createOrderDto);

      expect(result).toBeDefined();
      expect(result.orderNumber).toBe('ORD-123456');
      expect(result.total).toBe(23497);
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' },
      });
    });

    it('deve lançar BadRequestException quando carrinho está vazio', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      await expect(service.createOrder('user-1', createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException quando carrinho não tem itens', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue({
        ...mockCart,
        items: [],
      });

      await expect(service.createOrder('user-1', createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException quando produto não está ativo', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue({
        ...mockCart,
        items: [
          {
            ...mockCart.items[0],
            product: {
              ...mockCart.items[0].product,
              isActive: false,
            },
          },
        ],
      });

      await expect(service.createOrder('user-1', createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve aplicar desconto de cupom quando válido', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      mockPrismaService.coupon.findFirst.mockResolvedValue(mockCoupon);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({});

      const orderWithCoupon = {
        ...createOrderDto,
        couponCode: 'DESCONTO10',
      };

      await service.createOrder('user-1', orderWithCoupon);

      expect(mockPrismaService.coupon.findFirst).toHaveBeenCalledWith({
        where: {
          code: 'DESCONTO10',
          isActive: true,
          startsAt: { lte: expect.any(Date) },
          expiresAt: { gte: expect.any(Date) },
        },
      });
    });
  });

  describe('getOrder', () => {
    it('deve retornar pedido quando encontrado', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);

      const result = await service.getOrder('user-1', 'order-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('order-1');
      expect(result.orderNumber).toBe('ORD-123456');
    });

    it('deve lançar NotFoundException quando pedido não encontrado', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.getOrder('user-1', 'order-999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserOrders', () => {
    it('deve retornar lista de pedidos com paginação', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);
      mockPrismaService.order.count.mockResolvedValue(1);

      const result = await service.getUserOrders('user-1', 1, 10);

      expect(result).toEqual({
        orders: [expect.objectContaining({ id: 'order-1' })],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('deve usar valores padrão para paginação', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([]);
      mockPrismaService.order.count.mockResolvedValue(0);

      await service.getUserOrders('user-1');

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: expect.any(Object),
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateOrderStatus', () => {
    const updateDto = {
      status: OrderStatus.CONFIRMED,
      notes: 'Pedido confirmado',
    };

    it('deve atualizar status do pedido com sucesso', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.CONFIRMED,
      });

      const result = await service.updateOrderStatus('order-1', updateDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: {
          status: OrderStatus.CONFIRMED,
          notes: 'Pedido confirmado',
        },
        include: expect.any(Object),
      });
    });

    it('deve lançar NotFoundException quando pedido não encontrado', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.updateOrderStatus('order-999', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculateShippingCost', () => {
    it('deve retornar frete grátis para pedidos acima de R$ 100', () => {
      const result = service['calculateShippingCost'](10000);
      expect(result).toBe(0);
    });

    it('deve retornar frete padrão para pedidos abaixo de R$ 100', () => {
      const result = service['calculateShippingCost'](5000);
      expect(result).toBe(1500);
    });
  });

  describe('calculateTax', () => {
    it('deve calcular imposto de 10%', () => {
      const result = service['calculateTax'](10000);
      expect(result).toBe(1000);
    });
  });

  describe('calculateDiscount', () => {
    it('deve retornar 0 quando não há cupom', async () => {
      const result = await service['calculateDiscount']();
      expect(result).toBe(0);
    });

    it('deve retornar 0 quando cupom não é encontrado', async () => {
      mockPrismaService.coupon.findFirst.mockResolvedValue(null);

      const result = await service['calculateDiscount']('INVALID', 10000);
      expect(result).toBe(0);
    });

    it('deve calcular desconto percentual', async () => {
      mockPrismaService.coupon.findFirst.mockResolvedValue(mockCoupon);

      const result = await service['calculateDiscount']('DESCONTO10', 10000);
      expect(result).toBe(1000);
    });

    it('deve calcular desconto fixo', async () => {
      mockPrismaService.coupon.findFirst.mockResolvedValue({
        ...mockCoupon,
        type: 'FIXED',
        value: 500,
      });

      const result = await service['calculateDiscount']('DESCONTO10', 10000);
      expect(result).toBe(500);
    });
  });

  describe('generateOrderNumber', () => {
    it('deve gerar número de pedido único', () => {
      const result1 = service['generateOrderNumber']();
      const result2 = service['generateOrderNumber']();

      expect(result1).toMatch(/^ORD-/);
      expect(result2).toMatch(/^ORD-/);
      expect(result1).not.toBe(result2);
    });
  });
});
