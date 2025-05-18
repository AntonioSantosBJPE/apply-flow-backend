import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { NestCreatePublicTokenUseCase } from '@/infra/injectable-use-cases/auth/nest-create-public-token-use-case';
import { EnvService } from '@/infra/env/env.service';
import { Public } from '@/infra/auth/public';
import { ROUTES } from '@/core/constants/routes';

@ApiBearerAuth()
@ApiTags(ROUTES.PUBLIC_TOKEN.TAGS)
@Controller(ROUTES.PUBLIC_TOKEN.URL)
export class CreatePublicTokenController {
  constructor(
    private createPublicTokenUseCase: NestCreatePublicTokenUseCase,
    private envService: EnvService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({
    description: ROUTES.PUBLIC_TOKEN.DESCRIPTION,
    summary: ROUTES.PUBLIC_TOKEN.SUMMARY,
  })
  @ApiHeader({
    name: 'public-key',
    required: true,
    example: {
      'public-key': 'PUBLIC KEY',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Public token created successfully',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'HTTP Error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'HTTP Error' },
        error: { type: 'string', example: 'Public key invalid' },
      },
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
