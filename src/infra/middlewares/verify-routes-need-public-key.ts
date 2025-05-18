import { Request, Response, NextFunction } from 'express';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '../env/env.service';

@Injectable()
export class VerifyRoutesNeedPublicKeyMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private envService: EnvService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      next(new UnauthorizedException('Token is required'));
      return;
    }

    try {
      const publicKey = `-----BEGIN PUBLIC KEY-----\n${this.envService.get('PUBLIC_KEY')}\n-----END PUBLIC KEY-----`;

      this.jwtService.verify(token, {
        publicKey,
      });
      next();
    } catch (error) {
      console.log(error);
      next(new UnauthorizedException('Public token is invalid/expired'));
      return;
    }
  }
}
