import { Injectable } from '@nestjs/common';
import { AuthenticateUserUseCase } from '@/domain/auth/application/use-cases/authenticate-user';
import { UserRepository } from '@/domain/user/application/repositories/user-repository';
import { HashComparer } from '@/infra/cryptography/bcrypt-hasher';
import { TokenService } from '@/domain/auth/application/services/token.service';

@Injectable()
export class NestAuthenticateUserUseCase extends AuthenticateUserUseCase {
  constructor(
    userRepository: UserRepository,
    hashComparer: HashComparer,
    tokenService: TokenService,
  ) {
    super(userRepository, hashComparer, tokenService);
  }
}
