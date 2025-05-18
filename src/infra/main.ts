import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('Auth Guard API')
    .setDescription('Documentação da API do Auth Guard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (configService.get('ENABLE_SWAGGER') === 'TRUE') {
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(port);
}
void bootstrap();
