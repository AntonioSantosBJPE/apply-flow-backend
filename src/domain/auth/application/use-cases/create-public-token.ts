/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Either, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/error/errors/resource-not-found-error';
import { TOKEN_PERMISSION_TYPE } from '@/core/constants/token.type';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '@/infra/env/env.service';

interface CreatePublicTokenUseCaseRequest {
  publicKey: string;
  expiresIn?: string;
}

type CreatePublicTokenUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    publicToken: {
      token: string;
    };
  }
>;

export class CreatePublicTokenUseCase {
  constructor(
    private jwtService: JwtService,
    private env: EnvService,
  ) {}

  execute({
    publicKey,
    expiresIn,
  }: CreatePublicTokenUseCaseRequest): CreatePublicTokenUseCaseResponse {
    const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----\n${this.env.get('APP_PRIVATE_KEY')}\n-----END RSA PRIVATE KEY-----`;
    const subject = `##${TOKEN_PERMISSION_TYPE.PUBLIC}`;
    const token = this.jwtService.sign(
      {},
      {
        subject,
        expiresIn: expiresIn || '1d',
        algorithm: 'RS256',
        privateKey: privateKeyPem,
      },
    );
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

    try {
      this.jwtService.verify(token, {
        publicKey: publicKeyPem,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Public key invalid');
    }

    return right({
      publicToken: { token },
    });
  }
}
