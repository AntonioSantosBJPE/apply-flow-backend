import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { HttpModule } from './http/modules/http.module';
@Module({
  imports: [
    HttpModule,
    EnvModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
