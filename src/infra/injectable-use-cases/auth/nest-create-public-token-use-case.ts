import { CreatePublicTokenUseCase } from '@/domain/auth/application/use-cases/create-public-token';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class NestCreatePublicTokenUseCase extends CreatePublicTokenUseCase {
  constructor(jwtService: JwtService, envService: EnvService) {
    super(jwtService, envService);
  }
}
