# Entity Implementation Checklist

Use this checklist when implementing domain entities to ensure they follow the project's standards:

## Naming and Structure

- [ ] Use `snake_case` for all property names to match database columns
- [ ] Create an interface for entity props (`EntityProps`)
- [ ] Extend the base `Entity<Props>` class
- [ ] Implement a private constructor
- [ ] Implement a static `create` factory method

## Properties and Access

- [ ] Define getters for all properties using `snake_case` names
- [ ] Define setters for mutable properties
- [ ] Call `touch()` in all setters to update timestamps
- [ ] Use `UniqueEntityID` for ID references
- [ ] Handle optional properties with proper types (`Date | null`)

## State Tracking

- [ ] Implement a private `touch()` method to update timestamps
- [ ] Call `touch()` in all state-changing methods
- [ ] Add domain methods for common state changes

## Factory Method

- [ ] Use the `Optional<T, K>` type for defaultable properties
- [ ] Set default values for timestamps in the factory method
- [ ] Handle ID generation properly

## Example Implementation

```typescript
import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

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

export class User extends Entity<UserProps> {
  private touch() {
    this.props.updated_at = new Date();
  }

  // Getters and setters
  get email() {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
    this.touch();
  }

  // More getters and setters...

  // Computed properties
  get full_name() {
    return `${this.props.first_name} ${this.props.last_name}`;
  }

  // Private constructor
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  // Factory method
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

  // Domain methods
  public deactivate() {
    this.props.is_active = false;
    this.touch();
  }

  public activate() {
    this.props.is_active = true;
    this.touch();
  }

  // Other domain methods...
}
``` 