/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export abstract class TokenDecode {
  abstract decode(token: string, options?: any): Promise<any>;
}

@Injectable()
export class JwtDecode implements TokenDecode {
  constructor(private jwtService: JwtService) {}

  decode(token: string, options?: any): Promise<any> {
    return this.jwtService.decode(token, options);
  }
}
