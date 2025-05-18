# Zod Validation Pattern

## Overview

This project uses Zod for request validation directly within controller files, rather than separate DTO files, to maintain a more concise and focused approach.

## Controller-Level Schema Definition

Define Zod schemas directly in the controller file to keep related validation logic together with the route handling:

```typescript
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';

// Define schema with validations
const loginUserBodySchema = z.object({
  email: z.string().trim().min(3).max(255).email(),
  password: z.string().trim().min(6).max(45),
});

// Create a validation pipe instance specific to this schema
const bodyValidationPipe = new ZodValidationPipe(loginUserBodySchema);

// Create a class for type safety in controller parameters
class LoginUserBodySchema extends createZodDto(loginUserBodySchema) {}

@Controller()
@ApiTags(ROUTES.AUTH.LOGIN.TAGS)
export class LoginController {
  @Post(ROUTES.AUTH.LOGIN.URL)
  @HttpCode(200)
  async login(
    @Body(bodyValidationPipe) body: LoginUserBodySchema,
    // ...other parameters
  ) {
    // Implementation using validated body
  }
}
```

## Complete Example from LoginController

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

## Benefits of Inline Zod Schemas

1. **Colocation**: Validation rules are defined close to where they're used
2. **Type Safety**: Automatic type inference from Zod schema to DTO class
3. **Custom Error Messages**: Easy to add custom error messages for specific fields
4. **Reusability**: Create reusable validation pipes for different endpoints
5. **Clarity**: Anyone reading the controller can immediately see validation rules
6. **Single Source of Truth**: Schema and controller are updated together

## ZodValidationPipe Implementation

This is the implementation of the ZodValidationPipe used in controllers:

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

## Compared to Class-Validator Approach

The inline Zod approach offers several advantages over the traditional class-validator approach:

1. **Less Boilerplate**: No need for separate DTO classes with decorators
2. **Runtime Type Safety**: Zod performs runtime type checking
3. **Schema Composition**: Zod schemas can be easily composed and extended
4. **Inference**: TypeScript types are inferred from schemas automatically

## Example Usage

### Login Endpoint

```typescript
@Post(ROUTES.AUTH.LOGIN.URL)
@HttpCode(200)
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
``` 