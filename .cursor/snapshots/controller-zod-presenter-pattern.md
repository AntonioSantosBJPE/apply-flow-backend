# Controller Implementation with Zod and Presenter Pattern

This snapshot provides correct examples of controller implementation following the project's architectural patterns.

## Complete Controller Example

```typescript
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  Ip,
  Headers,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROUTES } from '@/core/constants/routes';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { LoginPresenter } from '@/infra/presenters/auth/login.presenter';
import { NestAuthenticateUserUseCase } from '@/infra/injectable-use-cases/auth/nest-authenticate-user-use-case';

const loginUserBodySchema = z.object({
  email: z.string().trim().min(3).max(255).email(),
  password: z.string().trim().min(6).max(45),
});

const bodyValidationPipe = new ZodValidationPipe(loginUserBodySchema);
class LoginUserBodySchema extends createZodDto(loginUserBodySchema) {}

@Controller()
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
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authenticateUser.execute({
      email: body.email,
      password: body.password,
      ipAddress: ip,
      deviceInfo: userAgent,
    });

    if (result.isLeft()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return LoginPresenter.toHttp(result.value);
  }
}
```

## Presenter Implementation

```typescript
import { BasePresenter } from '../base-presenter';

type LoginPresenterPayload = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export class LoginPresenter extends BasePresenter {
  static toHttp(data: LoginPresenterPayload) {
    return this.safeParse(
      data,
      (data) => ({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      }),
      'LoginPresenter',
    );
  }
}
```

## ZodValidationPipe Implementation

```typescript
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(fromZodError(error));
      }
      
      throw new BadRequestException('Validation failed');
    }
  }
}
```

## Key Implementation Points

1. **Inline Zod Validation**:
   - Define validation schemas in the controller file
   - Use the `ZodValidationPipe` for validation
   - Create a DTO class using `createZodDto` for type safety

2. **BasePresenter Pattern**:
   - Create presenters that extend BasePresenter
   - Use the safeParse method for error handling
   - Return properly formatted responses

3. **Route Constants**:
   - Use centralized route constants for URLs
   - Use constants for API documentation

4. **Error Handling**:
   - Check for `isLeft()` to handle domain errors
   - Transform domain errors to appropriate HTTP exceptions

5. **API Documentation**:
   - Document all endpoints with Swagger annotations
   - Provide clear descriptions and response schemas

6. **HTTP Status Codes**:
   - Use `@HttpCode()` to set explicit status codes 