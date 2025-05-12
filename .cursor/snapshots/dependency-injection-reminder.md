# 🚨 Dependency Injection Reminder

## Required Dependencies for Modules

When creating new use cases and controllers, ensure that all necessary dependencies are available in the correct module.

### ❌ COMMON ERROR - Dependencies not available in module context

```
Error: Nest can't resolve dependencies of the NestMyUseCase (?, TokenVerify).
Please make sure that the argument PrismaRepository at index [0] is available in the Module context.
```

### ✅ SOLUTION - Check module dependencies

Verify that repositories and services are available through `DependenciesModule`:

1. `DatabaseModule` exports all Prisma repositories
2. `CryptographyModule` exports `TokenVerify`, `Encrypter`, and other cryptography services
3. `MailModule` exports email services

### How to fix dependency issues:

1. Make sure the module imports `DependenciesModule`
2. If you need to export additional dependencies to other modules, add them to the `exports` array
3. For custom dependencies, register them as providers in your module:

```typescript
@Module({
  imports: [DependenciesModule],
  controllers: [MyController],
  providers: [
    MyUseCase,
    MyCustomService, // Custom service
  ],
  exports: [
    MyCustomService, // Export if other modules need it
  ],
})
export class MyModule {}
```

Remember: NestJS injects dependencies automatically, but they must be available in the module context!
