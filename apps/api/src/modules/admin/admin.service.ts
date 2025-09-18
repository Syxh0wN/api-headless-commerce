import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(query: any) {
    const { page = 1, limit = 20, search, category, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (status !== undefined) {
      where.isActive = status === 'active';
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          variants: {
            include: {
              inventory: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createProduct(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
        variants: true,
      },
    });

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        variants: {
          include: {
            inventory: true,
          },
        },
      },
    });

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Produto deletado com sucesso' };
  }

  async getProductVariants(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      include: {
        inventory: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return variants;
  }

  async createProductVariant(productId: string, variantData: any) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        ...variantData,
        productId,
      },
      include: {
        inventory: true,
      },
    });

    return variant;
  }

  async updateInventory(variantId: string, inventoryData: any) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variante não encontrada');
    }

    const inventory = await this.prisma.inventory.upsert({
      where: { variantId },
      update: {
        quantity: inventoryData.quantity,
        reserved: inventoryData.reserved || 0,
        available: inventoryData.quantity - (inventoryData.reserved || 0),
        lowStockThreshold: inventoryData.lowStockThreshold || 5,
      },
      create: {
        variantId,
        quantity: inventoryData.quantity,
        reserved: inventoryData.reserved || 0,
        available: inventoryData.quantity - (inventoryData.reserved || 0),
        lowStockThreshold: inventoryData.lowStockThreshold || 5,
      },
    });

    return inventory;
  }

  async getCoupons() {
    const coupons = await this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return coupons;
  }

  async createCoupon(createCouponDto: CreateCouponDto) {
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { code: createCouponDto.code },
    });

    if (existingCoupon) {
      throw new BadRequestException('Código de cupom já existe');
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        ...createCouponDto,
        name: createCouponDto.description || createCouponDto.code,
      },
    });

    return coupon;
  }

  async updateCoupon(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.prisma.coupon.findUnique({
        where: { code: updateCouponDto.code },
      });

      if (existingCoupon) {
        throw new BadRequestException('Código de cupom já existe');
      }
    }

    const updatedCoupon = await this.prisma.coupon.update({
      where: { id },
      data: updateCouponDto,
    });

    return updatedCoupon;
  }

  async deleteCoupon(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    await this.prisma.coupon.delete({
      where: { id },
    });

    return { message: 'Cupom deletado com sucesso' };
  }

  async getAllOrders(query: any) {
    const { page = 1, limit = 20, status, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
              variant: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
          shipping: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(id: string, statusData: any) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: statusData.status,
        notes: statusData.notes,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    return updatedOrder;
  }
}
