import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvModule } from '@/infra/env/env.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  exports: [DatabaseModule, CryptographyModule, EnvModule],
})
export class DependenciesModule {}
