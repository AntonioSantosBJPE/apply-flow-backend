# Presenter Pattern

## Overview

The Presenter pattern is used to transform domain/application layer responses into HTTP-friendly formats. Presenters ensure consistent API responses and handle the transformation of internal data structures to client-facing formats.

## Implementation

Presenters are implemented as classes with static methods that transform data, extending the BasePresenter class. They are placed in the `src/infra/presenters` directory, organized by domain:

```
src/infra/presenters/
├── auth/
│   └── login.presenter.ts
├── user/
│   └── user.presenter.ts
└── base-presenter.ts
```

## BasePresenter Pattern

All presenters should extend the BasePresenter class which provides error handling and safe parsing:

```typescript
export class BasePresenter {
  protected static safeParse<T, R>(
    data: T,
    transform: (data: T) => R,
    presenterName: string,
  ): R {
    try {
      return transform(data);
    } catch (error) {
      console.error(`Error in ${presenterName}:`, error);
      throw new Error(`Failed to transform data in ${presenterName}`);
    }
  }
}
```

## Standard Presenter Implementation

```typescript
// Correct implementation extending BasePresenter
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

## Using Presenters in Controllers

Presenters should be used in controllers to format the response before sending it to the client:

```typescript
@Controller()
export class LoginController {
  constructor(private authenticateUser: NestAuthenticateUserUseCase) {}

  @Post(ROUTES.AUTH.LOGIN.URL)
  async login(@Body(bodyValidationPipe) body: LoginUserBodySchema) {
    const result = await this.authenticateUser.execute({
      email: body.email,
      password: body.password,
    });

    if (result.isLeft()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Use presenter to format the response
    return LoginPresenter.toHttp(result.value);
  }
}
```

## Benefits of Using Presenters

1. **Separation of concerns**: Controllers focus on request handling, presenters on response formatting
2. **Consistent API responses**: Standardized response structure across endpoints
3. **Error handling**: Safe parsing with consistent error handling
4. **Field filtering**: Hide sensitive or internal data from client responses
5. **Reusability**: Presenters can be reused across different controllers

## Example: Converting Data Format

```typescript
// Domain data (typically in camelCase)
const domainData = {
  accessToken: 'jwt-token',
  refreshToken: 'refresh-token',
  user: {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    passwordHash: 'hashed-password',  // Sensitive data
  },
};

// Presented data (converted to snake_case and filtered)
const presentedData = LoginPresenter.toHttp(domainData);
// Result:
// {
//   access_token: 'jwt-token',
//   refresh_token: 'refresh-token',
//   user: {
//     id: '123',
//     name: 'John Doe',  // Combined and transformed
//     email: 'john@example.com',
//     // passwordHash is removed
//   },
// }
```

## Complex Presenters with Error Handling

For more complex transformations or when error handling is needed, extend the BasePresenter:

```typescript
export class ComplexPresenter extends BasePresenter {
  static toHttp(data: SomeComplexData) {
    return this.safeParse(
      data,
      (data) => ({
        // Transform data safely
        id: data.id,
        formatted_data: this.formatData(data),
      }),
      'ComplexPresenter',
    );
  }
  
  private static formatData(data: SomeComplexData) {
    // Complex formatting logic
  }
}
``` 