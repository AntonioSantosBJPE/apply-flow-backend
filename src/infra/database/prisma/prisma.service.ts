import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static instance: PrismaService | undefined;

  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}
