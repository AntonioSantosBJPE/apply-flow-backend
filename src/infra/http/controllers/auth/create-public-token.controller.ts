import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiHeader, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NestCreatePublicTokenUseCase } from '@/infra/injectable-use-cases/auth/nest-create-public-token-use-case';
import { EnvService } from '@/infra/env/env.service';
import { Public } from '@/infra/auth/public';

@ApiBearerAuth()
@ApiTags('Public Token')
@Controller('/public-token')
export class CreatePublicTokenController {
  constructor(
    private createPublicTokenUseCase: NestCreatePublicTokenUseCase,
    private envService: EnvService,
  ) {}

  @Public()
  @Get()
  @ApiHeader({
    name: 'public-key',
    required: true,
    example: {
      'public-key': 'PUBLIC KEY',
    },
  })
  handle(@Request() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const publicKey: string = request.headers['public-key'];

    if (!publicKey) {
      throw new UnauthorizedException('Public key not informed');
    }

    const result = this.createPublicTokenUseCase.execute({
      publicKey,
      expiresIn: this.envService.get('PUBLIC_TOKEN_EXPIRES_IN'),
    });

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.publicToken;
  }
}
