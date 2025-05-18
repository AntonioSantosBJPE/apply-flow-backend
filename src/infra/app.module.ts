import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { HttpModule } from './http/modules/http.module';
import { HttpLoggingMiddleware } from './middlewares/http-logging.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AllExceptionFilter } from './exceptions/all-exception.filter';
import { PrismaExceptionFilter } from './exceptions/prisma-exception.filter';
import { PrismaService } from './database/prisma/prisma.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CryptographyModule } from './cryptography/cryptography.module';
import { ROUTES_NEED_PUBLIC_KEY } from '@/core/constants/routes-need-public-key-routes';
import { VerifyRoutesNeedPublicKeyMiddleware } from './middlewares/verify-routes-need-public-key';
@Module({
  imports: [
    AuthModule,
    HttpModule,
    EnvModule,
    CryptographyModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minute
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useFactory: () => {
        return new AllExceptionFilter(PrismaService.getInstance());
      },
    },
    {
      provide: APP_FILTER,
      useFactory: () => {
        return new PrismaExceptionFilter(PrismaService.getInstance());
      },
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware para logging HTTP (deve ser o primeiro para registrar todas as requisições)
    consumer.apply(HttpLoggingMiddleware).forRoutes('{*splat}');
    consumer
      .apply(VerifyRoutesNeedPublicKeyMiddleware)
      .forRoutes(...ROUTES_NEED_PUBLIC_KEY);
  }
}
