# Domain Service Pattern Implementation

This snapshot provides correct examples of domain service implementation following the project's architectural patterns.

## Token Service Example

```typescript
// src/domain/auth/application/services/token.service.ts
import { Injectable } from '@nestjs/common';
import { Encrypter } from '@/domain/types/encrypter';
import { EnvService } from '@/infra/env/env.service';
import { TOKEN_PERMISSION_TYPE, TOKEN_TYPE } from '@/core/constants/token.type';
import { randomUUID } from 'node:crypto';
import { RefreshTokenRepository } from '../repositories/refresh-token-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface GenerateTokensResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private encrypter: Encrypter,
    private env: EnvService,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async generateTokens(
    userId: UniqueEntityID,
    ipAddress?: string,
    deviceInfo?: string,
  ): Promise<GenerateTokensResponse> {
    // Create access token
    const accessToken = await this.encrypter.encrypt(
      {
        sub: userId.toValue(),
        type: TOKEN_PERMISSION_TYPE.PRIVATE,
        token_type: TOKEN_TYPE.ACCESS,
      },
      {
        expiresIn: this.env.get('JWT_TOKEN_EXPIRES_IN'),
      },
    );

    // Create refresh token
    const refreshTokenId = randomUUID();
    const expiresIn = this.env.get('REFRESH_TOKEN_EXPIRES_IN');
    const refreshToken = await this.encrypter.encrypt(
      {
        sub: userId.toValue(),
        type: TOKEN_PERMISSION_TYPE.PRIVATE,
        token_type: TOKEN_TYPE.REFRESH,
        refresh_token_id: refreshTokenId,
      },
      {
        expiresIn,
      },
    );

    // Calculate expiration date
    const expiresInMs = Number(expiresIn) * 1000; // Convert to milliseconds
    const expiresAt = new Date(Date.now() + expiresInMs);

    // Store refresh token in the database
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId,
      expiresAt,
      ipAddress,
      deviceInfo,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
```

## Service Module Example

```typescript
// src/domain/auth/application/services/token-service.module.ts
import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { DependenciesModule } from '@/infra/http/modules/dependencies.module';

@Module({
  imports: [DependenciesModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenServiceModule {}
```

## Using Service in Use Case Example

```typescript
// src/domain/auth/application/use-cases/authenticate-user.ts
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
```

## Registering Service in Module Example

```typescript
// src/infra/http/http-modules/modules/auth.module.ts
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
```

## Injectable Use Case Example

```typescript
// src/infra/injectable-use-cases/auth/nest-authenticate-user-use-case.ts
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
```

## Key Implementation Points

1. **Service Design**:
   - Services are injectable classes with clear interfaces
   - Methods have explicit return types
   - Dependencies are injected through constructor
   - Services focus on specific domain operations

2. **Service Module**:
   - Each service has its own dedicated module
   - Service module imports DependenciesModule for repositories
   - Module exports the service to make it available to other modules

3. **Use Case Integration**:
   - Use cases inject services as dependencies
   - Clear separation between use case logic and service operations
   - Services abstract implementation details

4. **Module Organization**:
   - Domain modules import service modules
   - Clean dependency graph with clear direction
   - Following NestJS dependency injection patterns 