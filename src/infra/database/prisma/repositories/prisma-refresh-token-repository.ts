import { Injectable } from '@nestjs/common';
import {
  CreateRefreshTokenParams,
  RefreshTokenRepository,
} from '@/domain/auth/application/repositories/refresh-token-repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: CreateRefreshTokenParams): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token: params.token,
        user_id: params.userId.toValue(),
        expires_at: params.expiresAt,
        device_info: params.deviceInfo,
        ip_address: params.ipAddress,
      },
    });
  }

  async findByToken(
    token: string,
  ): Promise<{ userId: string; expires_at: Date } | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      select: {
        user_id: true,
        expires_at: true,
      },
    });

    if (!refreshToken) {
      return null;
    }

    return {
      userId: refreshToken.user_id,
      expires_at: refreshToken.expires_at,
    };
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { user_id: userId },
    });
  }
}
