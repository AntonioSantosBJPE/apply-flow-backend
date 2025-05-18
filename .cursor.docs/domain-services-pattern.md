# Domain Services Pattern

## Overview

Domain Services encapsulate business logic that doesn't naturally fit within a single entity and often involve multiple domain concepts or external dependencies. Unlike entities, services don't have an identity and are defined by what they do rather than what they are.

## When to Use Domain Services

Use a Domain Service when the operation:
- Involves multiple entities or aggregates
- Represents a significant business process or transformation
- Requires external dependencies like encryption or environment variables
- Is stateless and doesn't naturally belong to any single entity

## Project Structure for Domain Services

Domain services are placed in a dedicated `services` directory within their domain application layer:

```
src/domain/auth/application/
├── repositories/
│   └── refresh-token-repository.ts
├── services/
│   ├── token.service.ts
│   └── token-service.module.ts
└── use-cases/
    └── authenticate-user.ts
```

## Service Implementation Example

```typescript
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

## Service Module Registration

Services should have their own module for NestJS registration:

```typescript
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

## Using Domain Services in Use Cases

Domain services should be injected into use cases via constructor injection:

```typescript
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

## Importing Service Module in Domain Module

```typescript
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

## Benefits of Domain Services

1. **Single Responsibility**: Keep entities focused on their core identity and behaviors
2. **Reusability**: Services can be reused across multiple use cases
3. **Testability**: Services can be mocked and tested in isolation
4. **Encapsulation**: Encapsulate complex operations behind a simple interface
5. **Dependency Management**: Handle external dependencies cleanly
6. **Domain-Driven Design**: Align with DDD principles for domain services

## Common Domain Service Types

1. **TokenService**: Token generation, validation, and management
2. **NotificationService**: Sending notifications through various channels
3. **PaymentService**: Processing payments through payment gateways
4. **FileService**: Handling file operations
5. **CryptographyService**: Cryptographic operations

## Anti-Patterns to Avoid

1. **Anemic Services**: Services with no business logic, just passing through to repositories
2. **God Services**: Services that do too much and violate single responsibility
3. **Entity Logic in Services**: Business logic that belongs in entities
4. **Domain Logic in Infrastructure**: Business logic leaking into infrastructure layer 