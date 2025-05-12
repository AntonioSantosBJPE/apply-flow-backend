# Module Organization Checklist

Use this checklist before committing changes to ensure that all components are properly organized according to the project architecture.

## 1. File Placement ✓

- [ ] Domain use case is placed in correct domain folder (`src/domain/{domain-name}/application/use-cases/`)
- [ ] Domain interfaces/entities are in the correct domain folder (`src/domain/{domain-name}/enterprise/entities/`)
- [ ] NestJS injectable use case is in the correct infrastructure folder (`src/infra/http/injectable-use-cases/{domain-name}/`)
- [ ] Controller is in the correct domain controllers folder (`src/infra/http/controllers/{domain-name}/`)
- [ ] Presenter is in the correct domain presenters folder (`src/infra/http/presenters/{domain-name}/`)

## 2. Module Registration ✓

- [ ] Controller is registered in the correct domain module in `src/infra/http/http-modules/modules/`, NOT in the main `HttpModule`
- [ ] Injectable use case is registered in the same domain module as its controller
- [ ] Any required services are properly injected through the module system

## 3. Domain Assignment ✓

Have you registered your components in the correct domain module?

<!-- - **ClientModule**: For client entity, profiles, addresses, banking, settings
- **ClientUserModule**: For client user authentication, passwords, user profiles
- **SubscriptionModule**: For subscriptions, plans, payments, billing
- **FleetModule**: For vehicles, fleet management
- **TaskModule**: For tasks, assignments, scheduling
- **LogErrorModule**: For error logging and reporting
- **PermissionModule**: For roles and permissions
- **UserModule**: For system users (not client users)
- **PublicModule**: For public-facing APIs, non-authenticated endpoints -->

## 4. Module Architecture Integrity ✓

- [ ] No circular dependencies between modules
- [ ] Services that need to be used across modules are properly exported
- [ ] Domain logic is kept in domain use cases, not in controllers
- [ ] Controllers only handle HTTP concerns and delegate to use cases
- [ ] Error handling follows the Either pattern with appropriate mapping to HTTP responses

## 5. Presenter Implementation ✓

- [ ] Presenter extends the `BasePresenter` abstract class
- [ ] Uses the `safeParse` method for error handling
- [ ] Includes the presenter name as the context parameter
- [ ] Properly handles array existence checks before accessing elements
- [ ] Uses ternary operators for concise access to nested properties with fallbacks
- [ ] Uses proper type definitions from domain entities or repository responses
- [ ] Returns a consistent data structure matching the API documentation

## 6. Authentication and Authorization ✓

- [ ] Public endpoints are decorated with `@Public()` decorator
- [ ] Authenticated endpoints use appropriate guards
- [ ] Swagger documentation includes authentication requirements with `@ApiBearerAuth()`

## 7. Public Route Configuration ✓

For public endpoints, have you:

- [ ] Added the route constant in `src/core/constants/routes.ts` under the correct domain section
- [ ] Registered the route in `src/core/constants/routes-need-public-key-routes.ts` with the correct HTTP method
- [ ] Used the `@Public()` decorator on the controller method

Example in `routes.ts`:

```typescript
PUBLIC: {
  CLIENT_PROFILE: {
    ACCEPT_INVESTOR_PROFILE_CREATION: '/accept-investor-profile-creation',
  },
}
```

Example in `routes-need-public-key-routes.ts`:

```typescript
{
  method: RequestMethod.POST,
  path: ROUTES.PUBLIC.CLIENT_PROFILE.ACCEPT_INVESTOR_PROFILE_CREATION,
}
```

## Final Check ✓

If you've added new files or modified existing ones, verify:

- [ ] All controllers, use cases, and services are registered in their appropriate modules
- [ ] No domain-specific components are registered directly in the main `HttpModule`
- [ ] Feature is accessible through the appropriate API endpoints
- [ ] Unit and integration tests cover the new functionality
- [ ] Presenters properly handle edge cases and null/undefined values

Remember: The goal is to maintain a clean, domain-driven architecture where each module focuses on its specific responsibility.
