import { Module } from '@nestjs/common';
import { Encrypter } from '@/domain/types/encrypter';
import { HashComparer, HashGenerator } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';
import { BcryptHasher } from './bcrypt-hasher';
import { TokenVerify } from './jwt-verify';
import { TokenDecode } from './jwt-decode';
import { JwtDecode } from './jwt-decode';
import { JwtVerify } from './jwt-verify';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: TokenVerify, useClass: JwtVerify },
    { provide: TokenDecode, useClass: JwtDecode },
  ],
  exports: [Encrypter, HashComparer, HashGenerator, TokenVerify, TokenDecode],
})
export class CryptographyModule {}
