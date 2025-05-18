import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { TOKEN_PERMISSION_TYPE, TOKEN_TYPE } from '@/core/constants/token.type';

const tokenPayloadSchema = z.object({
  type: z.enum([TOKEN_PERMISSION_TYPE.PUBLIC, TOKEN_PERMISSION_TYPE.PRIVATE]),
  token_type: z.enum([TOKEN_TYPE.ACCESS, TOKEN_TYPE.REFRESH]),
  iat: z.number().int(),
  exp: z.number().int(),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const publicKey = config.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  validate(payload: TokenPayload) {
    try {
      return tokenPayloadSchema.parse(payload);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
