import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROUTES } from '@/core/constants/routes';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { LoginPresenter } from '@/infra/presenters/auth/login.presenter';
import { NestAuthenticateUserUseCase } from '@/infra/injectable-use-cases/auth/nest-authenticate-user-use-case';
import { Public } from '@/infra/auth/public';

const loginUserBodySchema = z.object({
  email: z.string().trim().min(3).max(255).email(),
  password: z.string().trim().min(6).max(45),
});

const bodyValidationPipe = new ZodValidationPipe(loginUserBodySchema);
class LoginUserBodySchema extends createZodDto(loginUserBodySchema) {}

@Controller()
@Public()
@ApiTags(ROUTES.AUTH.LOGIN.TAGS)
export class LoginController {
  constructor(private authenticateUser: NestAuthenticateUserUseCase) {}

  @Post(ROUTES.AUTH.LOGIN.URL)
  @HttpCode(200)
  @ApiOperation({
    summary: ROUTES.AUTH.LOGIN.SUMMARY,
    description: ROUTES.AUTH.LOGIN.DESCRIPTION,
  })
  @ApiResponse({
    status: 200,
    description: 'The authentication was successful and returned tokens',
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body(bodyValidationPipe) body: LoginUserBodySchema,
    @Ip() ip: string,
    // @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authenticateUser.execute({
      email: body.email,
      password: body.password,
      ipAddress: ip,
    });

    if (result.isLeft()) {
      throw new UnauthorizedException(result.value.message);
    }

    return LoginPresenter.toHttp(result.value);
  }
}
