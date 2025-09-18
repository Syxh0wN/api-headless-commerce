import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../../infra/prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProduct = {
    id: '1',
    name: 'Produto Teste',
    slug: 'produto-teste',
    sku: 'SKU123',
    description: 'Descrição do produto',
    price: 9999,
    categoryId: 'cat-1',
    tags: ['tag1', 'tag2'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createProductDto = {
      name: 'Produto Teste',
      slug: 'produto-teste',
      sku: 'SKU123',
      description: 'Descrição do produto',
      price: 9999,
      categoryId: 'cat-1',
      tags: ['tag1', 'tag2'],
    };

    it('deve criar um produto com sucesso', async () => {
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          ...createProductDto,
          isActive: true,
          tags: ['tag1', 'tag2'],
        },
      });
    });

    it('deve criar um produto com tags vazias quando não fornecidas', async () => {
      const dtoWithoutTags = { ...createProductDto };
      delete dtoWithoutTags.tags;
      
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      await service.create(dtoWithoutTags);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          ...dtoWithoutTags,
          isActive: true,
          tags: [],
        },
      });
    });
  });

  describe('findAll', () => {
    const query = {
      page: 1,
      limit: 10,
      search: 'teste',
      category: 'cat-1',
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    };

    it('deve retornar lista de produtos com paginação', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result).toEqual({
        products: [mockProduct],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('deve filtrar por busca quando fornecida', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);
      mockPrismaService.product.count.mockResolvedValue(0);

      await service.findAll(query);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          OR: [
            { name: { contains: 'teste', mode: 'insensitive' } },
            { description: { contains: 'teste', mode: 'insensitive' } },
          ],
          categoryId: 'cat-1',
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar produto quando encontrado', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve lançar NotFoundException quando produto não encontrado', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateProductDto = {
      name: 'Produto Atualizado',
      price: 19999,
    };

    it('deve atualizar produto com sucesso', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        ...updateProductDto,
      });

      const result = await service.update('1', updateProductDto);

      expect(result).toEqual({
        ...mockProduct,
        ...updateProductDto,
      });
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateProductDto,
          tags: ['tag1', 'tag2'],
        },
      });
    });

    it('deve lançar NotFoundException quando produto não encontrado', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.update('999', updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover produto com sucesso', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove('1');

      expect(result).toEqual({ message: 'Produto removido com sucesso' });
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve lançar NotFoundException quando produto não encontrado', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
