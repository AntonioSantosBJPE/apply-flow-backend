import { Module } from '@nestjs/common';
import { DependenciesModule } from '@/infra/http/modules/dependencies.module';

@Module({
  imports: [DependenciesModule],
  controllers: [],
  providers: [],
})
export class UserModule {}
