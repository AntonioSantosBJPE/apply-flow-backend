import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { DependenciesModule } from '@/infra/http/modules/dependencies.module';

@Module({
  imports: [DependenciesModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenServiceModule {}
