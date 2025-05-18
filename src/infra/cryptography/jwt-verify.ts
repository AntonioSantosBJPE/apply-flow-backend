/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export abstract class TokenVerify {
  abstract verify(token: string, options?: any): Promise<any>;
}

@Injectable()
export class JwtVerify implements TokenVerify {
  constructor(private jwtService: JwtService) {}

  verify(token: string, options?: any): Promise<any> {
    return this.jwtService.verifyAsync(token, options);
  }
}
