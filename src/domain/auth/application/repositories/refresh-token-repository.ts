import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface CreateRefreshTokenParams {
  token: string;
  userId: UniqueEntityID;
  expiresAt: Date;
  deviceInfo?: string;
  ipAddress?: string;
}

export abstract class RefreshTokenRepository {
  abstract create(params: CreateRefreshTokenParams): Promise<void>;
  abstract findByToken(
    token: string,
  ): Promise<{ userId: string; expires_at: Date } | null>;
  abstract deleteByToken(token: string): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
}
