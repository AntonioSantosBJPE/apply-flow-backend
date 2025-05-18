# Optional Type Usage

## Overview

The `Optional<T, K>` utility type allows you to make specific properties of a type optional while keeping the rest required. This is particularly useful for entity creation where certain fields might have default values.

## Definition

```typescript
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
```

## Usage in Entity Creation

When creating entities, use the `Optional` type to avoid having to specify properties that should have default values:

```typescript
import { Optional } from '@/core/types/optional';

// Entity properties interface
export interface UserProps {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  department_id: UniqueEntityID;
  position_id: UniqueEntityID;
  is_active: boolean;
  is_email_verified: boolean;
  last_login?: Date | null;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// Static factory method with Optional type
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

## Benefits of This Pattern

1. **Fewer Required Arguments**: Clients don't need to specify fields with default values
2. **Type Safety**: TypeScript will still enforce required properties
3. **Clear Intent**: Self-documenting which properties can be defaulted
4. **Centralized Defaults**: Default values are defined once in the factory method

## Examples

### Creating a New User

```typescript
// Only required properties need to be specified
const user = User.create({
  email: 'user@example.com',
  password_hash: 'hashed_password',
  first_name: 'John',
  last_name: 'Doe',
  department_id: new UniqueEntityID('department-id'),
  position_id: new UniqueEntityID('position-id'),
  is_active: true,
  is_email_verified: false,
});

// created_at, updated_at, and deleted_at are handled automatically
```

### With Some Optional Properties Specified

```typescript
const user = User.create({
  email: 'user@example.com',
  password_hash: 'hashed_password',
  first_name: 'John',
  last_name: 'Doe',
  department_id: new UniqueEntityID('department-id'),
  position_id: new UniqueEntityID('position-id'),
  is_active: true,
  is_email_verified: false,
  // Override default for this property
  created_at: new Date('2023-01-01'),
});
``` 