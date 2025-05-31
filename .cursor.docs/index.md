# ApplyFlow Backend Development Guidelines

Welcome to the ApplyFlow Backend development guidelines. This documentation provides important rules and best practices to ensure that all code follows the project's architecture and coding standards.

## Table of Contents

1. [**Rules**](./rules.md) - Core rules and standards for all development
2. [**Module Organization**](./module-organization.md) - Detailed guide on module organization
3. [**Checklist**](./checklist.md) - Pre-commit checklist for proper organization
4. [**Presenter Error Handling**](./presenter-error-handling.md) - Detailed guide for implementing presenter error handling

## Quick References

### Module Assignment Reference

Here's a quick reference for which module should contain specific controllers and use cases:

- **AuthModule**: User authentication, sessions, password management, JWT tokens
- **UserModule**: Candidate profiles, account management, preferences, dashboard
- **ApplicationModule**: Job applications, application tracking, document uploads, search and filtering
- **JobSiteModule**: Job sites/platforms management, global sites list, site selection
- **StatusModule**: Custom status management, status workflows, user-defined status categories
- **AnalyticsModule**: Dashboard data, statistics, trends analysis, reporting (future)

### Presenter Pattern

For proper handling of data transformation and error handling:

- Extend `BasePresenter` for all presenters
- Use `safeParse()` method for error handling
- Include presenter name as context for better error tracing
- Use conditional checks before accessing array elements
- Use ternary operators for concise access to nested properties with fallbacks
- Use proper types from domain repositories or entities as input parameters
- See the [Presenter Error Handling](./presenter-error-handling.md) documentation for detailed guidance or [Rules](./rules.md#presenter-pattern-and-error-handling) for quick examples

### Common Mistakes

1. **Don't** register domain-specific controllers in the main HttpModule
2. **Don't** place files in incorrect domain folders
3. **Don't** implement business logic in controllers
4. **Don't** create circular dependencies between modules
5. **Don't** access array elements without checking array existence first

### Best Practices

1. **Do** follow the Either pattern for error handling
2. **Do** use Zod for validation
3. **Do** document APIs with Swagger
4. **Do** mark public routes with @Public() decorator
5. **Do** follow consistent naming patterns
6. **Do** extend BasePresenter for all presenter classes
