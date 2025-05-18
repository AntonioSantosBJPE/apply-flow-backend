/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './jwt.strategy';

export const GetToken = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const [, token] = request.headers.authorization?.split(' ') ?? [];
    const jwtService = new JwtService();
    const tokenData = jwtService.decode(token) as TokenPayload;

    if (!tokenData) {
      throw new ForbiddenException();
    }

    return tokenData;
  },
);
