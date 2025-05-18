# Entity Implementation Guidelines

## Naming Conventions

When implementing entities in the domain layer, always ensure property names match the database column names:

- Use `snake_case` for property names in entity classes, not camelCase
- This ensures consistent naming between the domain model and database schema
- Examples:
  - Use `first_name` instead of `firstName`
  - Use `is_active` instead of `isActive`
  - Use `created_at` instead of `createdAt`

## Property Mutation Tracking

Always implement proper mutation tracking in domain entities:

1. Create a private `touch()` method to centralize timestamp updates:
```typescript
private touch() {
  this.props.updated_at = new Date();
}
```

2. Call this method after any state change to ensure updated_at is always current

## Getters and Setters

Entities should have both getters and setters:

```typescript
// Getter
get first_name() {
  return this.props.first_name;
}

// Setter with automatic timestamp update
set first_name(value: string) {
  this.props.first_name = value;
  this.touch();
}
```

## Optional Properties

1. Use the `Optional<T, K>` utility type for optional properties in entity constructors:

```typescript
import { Optional } from '@/core/types/optional';

public static create(
  props: Optional<UserProps, 'created_at' | 'updated_at' | 'deleted_at'>,
  id?: UniqueEntityID,
): User {
  const user = new User(
    {
      created_at: props.created_at ?? new Date(),
      updated_at: props.updated_at ?? new Date(),
      ...props,
    },
    id,
  );
  return user;
}
```

2. Use `null | undefined` for optional date fields to match Prisma's behavior:
```typescript
last_login?: Date | null;
deleted_at?: Date | null;
```

## Explicit Type Parameters in Repository Methods

When using `prisma-pagination` or similar libraries, always specify generic type parameters explicitly:

```typescript
const paginatedResult = await paginate<PrismaUser, Prisma.UserFindManyArgs>(
  this.prisma.user,
  {
    // query parameters
  },
  {
    page: params.page,
  },
);
```

## Mapper Implementation

Ensure mappers reference property names correctly:

```typescript
// Domain to Persistence
static toPrisma(user: User) {
  return {
    id: user.id.toValue(),
    email: user.email,
    password_hash: user.password_hash, // NOT user.passwordHash
    first_name: user.first_name,       // NOT user.firstName
    last_name: user.last_name,         // NOT user.lastName
    // etc.
  };
}

// Persistence to Domain
static toDomain(raw: PrismaUser): User {
  return User.create(
    {
      email: raw.email,
      password_hash: raw.password_hash,
      first_name: raw.first_name,
      // etc.
    },
    new UniqueEntityID(raw.id),
  );
}
```

## Call Mappers with Explicit Arguments

When mapping collections, use the explicit function call format instead of method references:

```typescript
// Correct
data: paginatedResult.data.map((user) => UserMapper.toDomain(user)),

// Avoid
data: paginatedResult.data.map(UserMapper.toDomain),
```

This ensures proper `this` binding and prevents potential type errors.

## Entity Factory Methods

Implement static factory methods with proper defaults:

```typescript
public static create(
  props: Optional<UserProps, 'created_at' | 'updated_at' | 'deleted_at'>,
  id?: UniqueEntityID,
): User {
  const user = new User(
    {
      created_at: props.created_at ?? new Date(),
      updated_at: props.updated_at ?? new Date(),
      ...props,
    },
    id,
  );
  return user;
}
```

This pattern allows for omitting certain fields while ensuring they have sensible default values. 