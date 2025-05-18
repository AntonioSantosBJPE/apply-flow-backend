# Cursor Rules

## Module Organization

### Module Placement

- All domain-specific controllers and use cases must be registered in their corresponding module in `src/infra/http/http-modules/modules/` rather than directly in the main `HttpModule`.
- The main `HttpModule` should only contain app-wide controllers and providers or those that don't fit into any specific domain module.
- Follow these domain module assignments:
  <!-- - `ClientModule`: All client, client profile, client address, and client bank related controllers and use cases
  - `ClientUserModule`: All client user authentication and user management related controllers and use cases
  - `SubscriptionModule`: All subscription, billing, and payment related controllers and use cases
  - `FleetModule`: All fleet and vehicle related controllers and use cases
  - `TaskModule`: All task related controllers and use cases
  - `LogErrorModule`: All error logging related controllers and use cases
  - `PermissionModule`: All permission and role related controllers and use cases
  - `UserModule`: All system user (not client user) related controllers and use cases
  - `PublicModule`: All public-facing API controllers and use cases -->

### Import Organization

- Import statements should be arranged in this order:
  1. External/third-party imports (e.g., NestJS, TypeScript utilities)
  2. Core application imports (from `@/core`)
  3. Domain imports (from `@/domain`)
  4. Infrastructure imports (from `@/infra`)
  5. Local imports (from the same directory or relative paths)

### File Placement

- Keep file placement consistent with the domain-driven architecture:
  - Domain use cases in `src/domain/{domain-name}/application/use-cases/`
  - Domain entities in `src/domain/{domain-name}/enterprise/entities/`
  - Infrastructure use case implementations in `src/infra/http/injectable-use-cases/{domain-name}/`
  - Controllers in `src/infra/http/controllers/{domain-name}/`
  - Presenters in `src/infra/http/presenters/{domain-name}/`

## Code Style and Architecture

### Use Case Implementation

- All business logic should be implemented in domain use cases
- Use cases should follow the pattern of returning `Either<Error, Result>`
- Controller methods should properly handle the Either pattern and map to HTTP responses

### API Endpoint Design

- Public endpoints should be decorated with `@Public()` decorator
- ALL endpoints (including public ones) should be decorated with `@ApiBearerAuth()` for Swagger documentation
- Authentication required endpoints should use `@ApiBearerAuth()` without the `@Public()` decorator
- Use appropriate HTTP methods for endpoints (GET, POST, PUT, DELETE)
- Document API endpoints with Swagger decorators
- Set explicit HTTP status codes with `@HttpCode()` decorator

Example:
```typescript
import { Public } from '@/infra/auth/public';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth() // Required for ALL endpoints for Swagger docs
@Controller()
@Public() // Only for public endpoints
export class LoginController {
  @Post('/login')
  @HttpCode(200)
  async login() {
    // Implementation
  }
}
```

### Presenter Pattern and Error Handling

- All presenters must extend the `BasePresenter` abstract class
- Use the `safeParse` method provided by `BasePresenter` for error handling
- Always include the presenter name as the context parameter in `safeParse`
- Ensure proper null/undefined checking for nested properties
- Use conditional checks and ternary operators for nested properties
- Use proper types from domain repositories or entities as input parameters
- Don't rely on try/catch in controllers for presenter errors

Example presenter implementation:

```typescript
import { FindByIdWithPlanClientUserResponse } from '@/domain/client-user/application/repositories/clients-users-repository'
import { BasePresenter } from '../base-presenter'

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

For presenter errors, use the `PresenterExceptionFactory` which will create appropriate HTTP exceptions

### Public Route Configuration

When creating public endpoints, you must configure them in two places:

1. Add the route constant in `src/core/constants/routes.ts`:

   ```typescript
   export const ROUTES = {
     PUBLIC: {
       // Example: Add your route in the appropriate domain section
       CLIENT_PROFILE: {
         ACCEPT_INVESTOR_PROFILE_CREATION: '/accept-investor-profile-creation',
       },
     },
   }
   ```

2. Register the route in `src/core/constants/routes-need-public-key-routes.ts`:
   ```typescript
   export const ROUTES_NEED_PUBLIC_KEY: RouteInfo[] = [
     // Add your public route
     {
       method: RequestMethod.POST, // Use appropriate HTTP method
       path: ROUTES.PUBLIC.CLIENT_PROFILE.ACCEPT_INVESTOR_PROFILE_CREATION,
     },
   ]
   ```

Both files must be updated for public routes to work correctly.

### Validation

- Use Zod for validation
- Define validation schemas near the controller
- Use dedicated validation pipes

## Error Handling

- Use domain specific errors that extend from base Error classes
- Map domain errors to appropriate HTTP exceptions in controllers
- Use consistent error codes and messages
- For presenter errors, use the `PresenterExceptionFactory` which will create appropriate HTTP exceptions
