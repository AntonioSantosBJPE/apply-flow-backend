# Module Organization Guide

## Overview

This application follows a domain-driven architecture with modular organization. Each domain has its own module that encapsulates related controllers, use cases, and services. This guide explains how to properly organize code across the different modules.

## Module Structure

### Domain Modules

All domain-specific features are organized in separate modules located in `src/infra/http/http-modules/modules/`. Each domain module follows this general structure:

```typescript
@Module({
  imports: [DependenciesModule],
  controllers: [
    // All controllers related to this domain
  ],
  providers: [
    // All use cases and services related to this domain
  ],
  exports: [
    // Services or use cases that need to be used by other modules
  ],
})
export class DomainModule {}
```

### Main HTTP Module

The main `HttpModule` in `src/infra/http/http.module.ts` serves as an aggregator that imports all domain modules and registers only app-wide controllers and providers that don't belong to any specific domain.

```typescript
@Module({
  imports: [
    DependenciesModule,
    AuthModule,
    UserModule,
    ApplicationModule,
    JobSiteModule,
    StatusModule,
    // AnalyticsModule (future),
    // Other domain modules...
  ],
  controllers: [
    // Only app-wide controllers
  ],
  providers: [
    // Only app-wide providers
  ],
})
export class HttpModule {}
```

## Presenter Pattern and Error Handling

Presenters are responsible for transforming domain entities into HTTP response formats. To ensure consistent error handling, all presenters should follow this pattern:

### BasePresenter

All presenters must extend the `BasePresenter` abstract class, which provides error handling:

```typescript
// src/infra/http/presenters/base-presenter.ts
export abstract class BasePresenter {
  static safeParse<T, R>(
    data: T,
    parserFn: (data: T) => R,
    context: string,
  ): R {
    try {
      if (data === null || data === undefined) {
        throw new Error('Input data is null or undefined')
      }

      return parserFn(data)
    } catch (error) {
      console.error(
        `Error in presenter ${context} with data:`,
        JSON.stringify(
          data,
          (key, value) =>
            value !== null && typeof value === 'object' && !Array.isArray(value)
              ? Object.keys(value).length > 20
                ? '[Object]'
                : value
              : value,
          2,
        ).substring(0, 1000), // Limit log size
      )

      throw PresenterExceptionFactory.create(error, context)
    }
  }
}
```

### PresenterExceptionFactory

This factory class converts errors into appropriate HTTP exceptions:

```typescript
// src/infra/http/factories/presenter-exception.factory.ts
export class PresenterExceptionFactory {
  static create(error: unknown, context: string): HttpException {
    if (error instanceof HttpException) {
      return error
    }

    if (error instanceof Error) {
      const errorResponse = {
        message: `Error processing data in ${context}.`,
        error: error.message,
        statusCode: 500,
      }

      // Log the full error details for debugging
      console.error('Presenter error details:', errorResponse)

      return new BadRequestException(errorResponse)
    }

    // For unknown errors
    const errorResponse = {
      message: `Unexpected error in ${context}`,
      error: 'An unexpected error occurred while processing your request',
      statusCode: 500,
    }

    console.error('Presenter unknown error:', errorResponse)

    return new InternalServerErrorException(errorResponse)
  }
}
```

### Implementing a Presenter

When creating a presenter, follow this pattern:

```typescript
import { GetApplicationWithJobDetailsResponse } from '@/domain/application/application/repositories/applications-repository'
import { BasePresenter } from '../base-presenter'

export class ViewApplicationPresenter extends BasePresenter {
  static toHTTP(application: GetApplicationWithJobDetailsResponse) {
    return this.safeParse(
      application,
      (data) => ({
        id: data.id,
        job_id: data.job_id,
        user_id: data.user_id,
        status: data.status,
        applied_at: data.applied_at,
        company_name: data.job?.company?.name || null,
        job_title: data.job?.title || null,
        application_stage: data.application_stage,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }),
      'ViewApplicationPresenter',
    )
  }
}
```

### Key Best Practices for Presenters

1. Always extend `BasePresenter`
2. Use `safeParse()` to handle potential errors
3. Provide meaningful context (the presenter name)
4. Use conditional checks for array existence before accessing elements
5. Use ternary operators for concise property access with fallbacks
6. Type your input parameters using domain types
7. Return consistent data structures for API responses

## Public Route Configuration

When creating a public route in the application, you need to configure it in multiple places:

### 1. Mark the Controller Method as Public

Use the `@Public()` decorator to make the route accessible without authentication:

```typescript
import { Public } from '@/infra/auth/public'

@Controller('/my-endpoint')
export class MyController {
  @Public()
  @Post()
  async handle() {
    // Implementation
  }
}
```

### 2. Define the Route in Constants

Add the route in the `routes.ts` file under the appropriate domain section:

```typescript
// src/core/constants/routes.ts
export const ROUTES = {
  PUBLIC: {
    JOB_SITES: {
      LIST_SITES: '/job-sites',
      // Add your new route here
    },
  },
}
```

### 3. Register for Public Key Authentication

Register the route in `routes-need-public-key-routes.ts` to enable public key authentication:

```typescript
// src/core/constants/routes-need-public-key-routes.ts
import { RequestMethod } from '@nestjs/common'
import { ROUTES } from './routes'

export const ROUTES_NEED_PUBLIC_KEY: RouteInfo[] = [
  // Other routes...
  {
    method: RequestMethod.GET, // Use appropriate method (POST, GET, etc.)
    path: ROUTES.PUBLIC.JOB_SITES.LIST_SITES,
  },
]
```

This three-step process ensures the route is properly accessible as a public endpoint while still being protected by the public key authentication mechanism.

## Domain Assignment Reference

When adding new features, follow this reference to determine which module should contain your controllers and use cases:

### AuthModule

- User authentication and registration
- Session management
- Password management (reset, change)
- JWT token handling
- Login/logout functionality

### UserModule

- Candidate profile management
- Account settings and preferences
- Dashboard data aggregation
- User preferences and customization
- Account deletion and data export

### ApplicationModule

- Job application creation and management
- Application status tracking
- Document uploads (CV, cover letters)
- Application search and filtering
- Application analytics and statistics

### JobSiteModule

- Job sites/platforms catalog
- Global sites list management
- Site selection for applications
- Site categorization and search
- Popular sites tracking

### StatusModule

- Custom status creation and management
- Status workflow definition
- Status reordering and customization
- Default status templates
- Status color and icon management

### AnalyticsModule (Future)

- Dashboard statistics
- Trend analysis
- Performance reports
- Data visualization
- Export functionality

## Code Organization Rules

### Adding New Controllers and Use Cases

1. **Step 1**: Create the domain use case in `src/domain/{domain-name}/application/use-cases/`
2. **Step 2**: Create the NestJS injectable use case in `src/infra/http/injectable-use-cases/{domain-name}/`
3. **Step 3**: Create the controller in `src/infra/http/controllers/{domain-name}/`
4. **Step 4**: Create any necessary presenters in `src/infra/http/presenters/{domain-name}/`
5. **Step 5**: Register the controller and use case in the appropriate domain module, NOT in the main HttpModule

### Example: Adding a New Status Feature

If you're adding a feature for creating custom status, you would:

1. Create `src/domain/status/application/use-cases/create-custom-status.ts`
2. Create `src/infra/http/injectable-use-cases/status/nest-create-custom-status-use-case.ts`
3. Create `src/infra/http/controllers/status/create-custom-status.controller.ts`
4. Create `src/infra/http/presenters/status/create-custom-status-presenter.ts`
5. Register in `src/infra/http/http-modules/modules/status.module.ts`:

```typescript
@Module({
  imports: [DependenciesModule],
  controllers: [
    // Existing controllers...
    CreateCustomStatusController,
  ],
  providers: [
    // Existing providers...
    NestCreateCustomStatusUseCase,
  ],
})
export class StatusModule {}
```

## Common Mistakes to Avoid

1. **Incorrect Module Registration**: Never register domain-specific controllers or use cases directly in the main HttpModule.

2. **Cross-Domain Dependencies**: If a use case needs functionality from another domain, inject the necessary services through the module's exports rather than coupling the domains directly.

3. **Inconsistent File Placement**: Always follow the established pattern for file organization to maintain consistency.

4. **Circular Dependencies**: Be careful with dependencies between modules to avoid circular dependencies. Use interfaces and forward references when necessary.

5. **Overloaded Modules**: Keep modules focused on their specific domain. If a module is growing too large, consider breaking it into smaller, more focused modules.

6. **Unsafe Property Access in Presenters**: Always use optional chaining and null checks when accessing nested properties in presenters to avoid runtime errors.

## Repository Dependency Injection

When working with repositories across modules, follow these guidelines to avoid dependency injection errors:

1. **Use DependenciesModule**: All repositories are provided and exported through the `DatabaseModule`, which is imported and exported by the `DependenciesModule`. Always import `DependenciesModule` in your feature modules.

2. **Avoid duplicate provider definitions**: Never define repository providers in feature modules that are already defined in the `DatabaseModule`. This creates conflicts in the dependency injection system.

3. **Use case dependencies**: When creating injectable use cases that depend on repositories, make sure the repository interface is in the export list of the `DatabaseModule`.

4. **Common errors**:

   - If you get an error like `Nest can't resolve dependencies of the NestXxxUseCase (?, Repository2). Please make sure that the argument Repository1 at index [0] is available in the Module context`:
     - First check that the repository is exported in the `DatabaseModule` exports array
     - Ensure your feature module imports `DependenciesModule`
     - DON'T add a duplicate provider definition in your feature module for repositories already in DatabaseModule

5. **Repository order**: Make sure that constructor injection follows the same parameter order as defined in the base class:

   ```typescript
   // Base class
   export class CreateClientVehicleExtraUseCase {
     constructor(
       private clientsVehiclesExtrasRepository: ClientsVehiclesExtrasRepository,
       private clientsRepository: ClientsRepository,
     ) {}
   }

   // Injectable class - SAME ORDER of parameters is crucial
   @Injectable()
   export class NestCreateClientVehicleExtraUseCase extends CreateClientVehicleExtraUseCase {
     constructor(
       clientsVehiclesExtrasRepository: ClientsVehiclesExtrasRepository,
       clientsRepository: ClientsRepository,
     ) {
       super(clientsVehiclesExtrasRepository, clientsRepository)
     }
   }
   ```

## Dependencies in Modules

All domain modules must import `DependenciesModule` to access common infrastructure:

- `DatabaseModule` provides all Prisma repositories
- `CryptographyModule` provides TokenVerify, Encrypter, and other crypto services
- `MailModule` provides email services
- `FileModule` provides file handling services
- `EnvModule` provides environment configuration

```typescript
@Module({
  imports: [DependenciesModule], // This is essential for access to repositories and services
  controllers: [
    /* controllers */
  ],
  providers: [
    /* use cases and services */
  ],
})
export class DomainModule {}
```

When adding a new use case or service that depends on repositories or services:

1. Ensure the module imports `DependenciesModule`
2. Check that the repository or service is exported by one of the modules imported
3. If using a custom service, register it in the providers array
4. For dependencies used by other modules, add them to the exports array

## Common Dependency Injection Errors

### Error: Can't resolve dependencies

If you see an error like:

```
Error: Nest can't resolve dependencies of the NestMyUseCase (?, TokenVerify).
Please make sure that the argument Repository at index [0] is available in the Module context.
```

This usually means:

1. The dependency (like a repository) is not available in the module context
2. The order of dependencies in the constructor doesn't match the base class

### How to fix dependency injection errors:

1. **Check the DependenciesModule import**: Ensure the module imports DependenciesModule
2. **Check dependency order**: Ensure the order of constructor parameters in your NestJS injectable classes matches the order in the base classes
3. **Register missing providers**: If using custom services, register them in the module's providers array
4. **Check for circular dependencies**: Avoid circular dependencies between modules

## Domain Modules

Domain modules should:

- Focus on specific business domain
- Export only what's necessary for other modules
- Keep implementation details private
- Use clear dependency injection

## Infrastructure Modules

Infrastructure modules handle external concerns:

- Database connections
- HTTP controllers
- Authentication
- File storage
- Queue management
- Email services

## Module Registration

Use appropriate registration techniques:

- `useClass` for standard implementations
- `useFactory` for dynamic configuration
- `useValue` for static configuration
- `forRoot`/`forFeature` pattern for modules with configuration

## Provider Registration

- Register providers within their respective modules
- Use appropriate scope (default, request, transient)
- Consider using custom provider tokens for better decoupling

## Circular Dependencies

- Avoid circular dependencies between modules
- Use forward references when necessary
- Consider extracting shared code to common modules

## File Organization with Modules

When adding new features, follow this organization:

1. Create the domain use case in `src/domain/{domain-name}/application/use-cases/`
2. Create the NestJS injectable use case in `src/infra/http/injectable-use-cases/{domain-name}/`
3. Create the controller in `src/infra/http/controllers/{domain-name}/`
4. Create any necessary presenters in `src/infra/http/presenters/{domain-name}/`
5. Register the controller and use case in the appropriate domain module, NOT in the main HttpModule
6. Ensure all dependencies are available through `DependenciesModule` or registered in the module

## Módulos Específicos

### DepartmentModule

O módulo `DepartmentModule` deve ser registrado no diretório `src/infra/http/http-modules/modules/department.module.ts` e ser responsável por:

- Gerenciar entidades de departamento
- Lidar com permissões específicas de departamento
- Implementar operações CRUD para departamentos

**Use Cases**:
- CreateDepartmentUseCase
- UpdateDepartmentUseCase
- FindDepartmentByIdUseCase
- DeleteDepartmentUseCase
- ListDepartmentsUseCase
- AssignPermissionToDepartmentUseCase
- RemovePermissionFromDepartmentUseCase
- ListDepartmentPermissionsUseCase

**Controllers**:
- DepartmentController
- DepartmentPermissionController

### PositionModule

O módulo `PositionModule` deve ser registrado no diretório `src/infra/http/http-modules/modules/position.module.ts` e ser responsável por:

- Gerenciar cargos (posições) dentro dos departamentos
- Lidar com permissões específicas de cargo
- Implementar operações CRUD para cargos

**Use Cases**:
- CreatePositionUseCase
- UpdatePositionUseCase
- FindPositionByIdUseCase
- DeletePositionUseCase
- ListPositionsUseCase
- ListPositionsByDepartmentUseCase
- AssignPermissionToPositionUseCase
- RemovePermissionFromPositionUseCase
- ListPositionPermissionsUseCase

**Controllers**:
- PositionController
- PositionPermissionController

### PermissionGroupModule

O módulo `PermissionGroupModule` deve ser registrado no diretório `src/infra/http/http-modules/modules/permission-group.module.ts` e ser responsável por:

- Gerenciar grupos de permissões relacionadas
- Facilitar a organização e atribuição de permissões
- Implementar operações CRUD para grupos de permissões

**Use Cases**:
- CreatePermissionGroupUseCase
- UpdatePermissionGroupUseCase
- FindPermissionGroupByIdUseCase
- DeletePermissionGroupUseCase
- ListPermissionGroupsUseCase
- AddPermissionToGroupUseCase
- RemovePermissionFromGroupUseCase
- ListPermissionsInGroupUseCase

**Controllers**:
- PermissionGroupController

### AuthorizationModule

O módulo `AuthorizationModule` deve ser registrado no diretório `src/infra/http/http-modules/modules/authorization.module.ts` e ser responsável por:

- Implementar o sistema de verificação de permissões
- Fornecer middlewares e guards para autorização
- Gerenciar o cache de permissões

**Providers**:
- PermissionVerificationService
- CachedPermissionVerificationService
- PermissionGuard
- AuthorizationMiddleware

**Guards**:
- PermissionGuard
