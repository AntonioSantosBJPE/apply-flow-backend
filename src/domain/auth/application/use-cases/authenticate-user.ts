import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from '@/core/error/errors/wrong-credentials-error';
import { HashComparer } from '@/infra/cryptography/bcrypt-hasher';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/domain/user/application/repositories/user-repository';
import { TokenService } from '../services/token.service';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
  ipAddress?: string;
  deviceInfo?: string;
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private tokenService: TokenService,
  ) {}

  async execute({
    email,
    password,
    ipAddress,
    deviceInfo,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const passwordMatches = await this.hashComparer.compare(
      password,
      user.password_hash,
    );

    if (!passwordMatches) {
      return left(new WrongCredentialsError());
    }

    // Update last login
    user.updateLastLogin();
    await this.userRepository.save(user);

    // Generate tokens using the token service
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user.id, ipAddress, deviceInfo);

    return right({
      accessToken,
      refreshToken,
      user: {
        id: user.id.toValue(),
        name: user.full_name,
        email: user.email,
      },
    });
  }
}
