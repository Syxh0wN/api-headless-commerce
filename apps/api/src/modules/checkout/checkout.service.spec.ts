import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from './checkout.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateOrderDto, PaymentMethod } from './dto/create-order.dto';
import { UpdateOrderStatusDto, OrderStatus } from './dto/update-order-status.dto';

describe('CheckoutService', () => {
  let service: CheckoutService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
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
      cartId: 'cart-1',
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
      const result = await service.createOrder('user-1', createOrderDto);

      expect(result).toBeDefined();
      expect(result.orderNumber).toMatch(/^ORD-/);
      expect(result.userId).toBe('user-1');
      expect(result.status).toBe('PENDING');
    });
  });

  describe('getOrder', () => {
    it('deve retornar pedido quando encontrado', async () => {
      const result = await service.getOrder('user-1', 'order-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('order-1');
      expect(result.orderNumber).toMatch(/^ORD-/);
    });
  });

  describe('listOrders', () => {
    it('deve retornar lista de pedidos', async () => {
      const result = await service.listOrders('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('updateOrderStatus', () => {
    const updateDto: UpdateOrderStatusDto = {
      status: OrderStatus.CONFIRMED,
      notes: 'Pedido confirmado',
    };

    it('deve atualizar status do pedido com sucesso', async () => {
      const result = await service.updateOrderStatus('order-1', updateDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('order-1');
      expect(result.status).toBe('CONFIRMED');
    });
  });
});
