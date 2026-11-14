import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

interface ClerkUser {
  id: string;
}

@Injectable()
export class ClerkWebhookService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: ClerkUser) {
    return this.prismaService.user.upsert({
      where: {
        id: data.id,
      },
      create: {
        id: data.id,
      },
      update: {},
    });
  }
}