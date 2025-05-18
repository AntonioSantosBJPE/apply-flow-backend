import { Module } from '@nestjs/common';
import { DependenciesModule } from '@/infra/http/modules/dependencies.module';
import { LoginController } from '../../controllers/auth/login.controller';
import { NestAuthenticateUserUseCase } from '@/infra/injectable-use-cases/auth/nest-authenticate-user-use-case';
import { TokenServiceModule } from '@/domain/auth/application/services/token-service.module';

@Module({
  imports: [DependenciesModule, TokenServiceModule],
  controllers: [LoginController],
  providers: [NestAuthenticateUserUseCase],
})
export class AuthModule {}
