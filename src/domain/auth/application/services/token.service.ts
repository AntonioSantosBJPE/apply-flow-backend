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
