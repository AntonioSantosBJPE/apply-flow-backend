import { Module } from '@nestjs/common';
import { CreatePublicTokenController } from '../controllers/auth/create-public-token.controller';
import { NestCreatePublicTokenUseCase } from '@/infra/injectable-use-cases/auth/nest-create-public-token-use-case';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@/infra/exceptions/http-exception.filter';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DependenciesModule } from './dependencies.module';

@Module({
  imports: [DependenciesModule],
  controllers: [CreatePublicTokenController],
  providers: [
    NestCreatePublicTokenUseCase,
    {
      provide: APP_FILTER,
      useFactory: () => {
        return new HttpExceptionFilter(PrismaService.getInstance());
      },
    },
  ],
})
export class HttpModule {}
