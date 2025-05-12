# 🚨 Module Organization Reminder

## Domain-Specific Controllers And Use Cases

When creating new features, remember to register controllers and use cases in the correct domain module:

### ❌ INCORRECT - Don't register in main HttpModule

```typescript
// src/infra/http/http.module.ts
@Module({
  imports: [
    /* ... */
  ],
  controllers: [
    // DON'T PUT DOMAIN CONTROLLERS HERE
    SomeClientController, // ❌ WRONG
  ],
  providers: [
    // DON'T PUT DOMAIN USE CASES HERE
    NestSomeClientUseCase, // ❌ WRONG
  ],
})
export class HttpModule {}
```

### ✅ CORRECT - Register in the appropriate domain module

```typescript
// src/infra/http/http-modules/modules/client.module.ts
@Module({
  imports: [DependenciesModule],
  controllers: [
    // ...other controllers
    SomeClientController, // ✅ CORRECT
  ],
  providers: [
    // ...other providers
    NestSomeClientUseCase, // ✅ CORRECT
  ],
})
export class ClientModule {}
```

## Domain Module Quick Reference

Match your functionality to the appropriate module:
<!-- 
- **ClientModule**: Client profiles, addresses, banking, settings
- **ClientUserModule**: User authentication, passwords, profiles
- **SubscriptionModule**: Subscriptions, plans, payments, billing
- **FleetModule**: Vehicles, fleet management, maintenance
- **TaskModule**: Tasks, assignments, scheduling
- **LogErrorModule**: Error logging, reporting, system logs
- **PermissionModule**: Roles, permissions, access control
- **UserModule**: System users (admin accounts)
- **PublicModule**: Public-facing APIs, non-authenticated endpoints -->

For more details, see the [Module Organization Guide](./.cursor.docs/module-organization.md).
