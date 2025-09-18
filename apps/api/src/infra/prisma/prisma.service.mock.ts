import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaServiceMock {
  user = {
    findUnique: async () => null,
    create: async (data: any) => ({
      id: 'mock-id',
      email: data.data.email,
      name: data.data.name,
      role: 'CUSTOMER',
      createdAt: new Date(),
    }),
  };

  async $connect() {
    console.log('Mock Prisma connected');
  }

  async $disconnect() {
    console.log('Mock Prisma disconnected');
  }
}
