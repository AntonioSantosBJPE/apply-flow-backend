# Entity and Mapper Implementation Examples

This snapshot provides correct examples of entity and mapper implementations to reference when building new features.

## Entity Implementation

```typescript
import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

// Properties interface with snake_case naming
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
  // Timestamp update method
  private touch() {
    this.props.updated_at = new Date();
  }

  // Getters and setters with proper naming
  get email() {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
    this.touch(); // Update timestamp on change
  }

  get password_hash() {
    return this.props.password_hash;
  }

  set password_hash(value: string) {
    this.props.password_hash = value;
    this.touch();
  }

  get first_name() {
    return this.props.first_name;
  }

  set first_name(value: string) {
    this.props.first_name = value;
    this.touch();
  }

  get last_name() {
    return this.props.last_name;
  }

  set last_name(value: string) {
    this.props.last_name = value;
    this.touch();
  }

  // Reference ID properties
  get department_id() {
    return this.props.department_id;
  }

  set department_id(value: UniqueEntityID) {
    this.props.department_id = value;
    this.touch();
  }

  // Booleans
  get is_active() {
    return this.props.is_active;
  }

  set is_active(value: boolean) {
    this.props.is_active = value;
    this.touch();
  }

  // Calculated properties
  get full_name() {
    return `${this.props.first_name} ${this.props.last_name}`;
  }

  // Private constructor
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  // Factory method with Optional type
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

  // Domain behavior methods
  public deactivate() {
    this.props.is_active = false;
    this.touch();
  }

  public activate() {
    this.props.is_active = true;
    this.touch();
  }

  public verifyEmail() {
    this.props.is_email_verified = true;
    this.touch();
  }
}
```

## Mapper Implementation

```typescript
import { User as PrismaUser } from 'generated/prisma';
import { User } from '@/domain/user/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class UserMapper {
  // Persistence to Domain mapping
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        password_hash: raw.password_hash,
        first_name: raw.first_name,
        last_name: raw.last_name,
        department_id: new UniqueEntityID(raw.department_id),
        position_id: new UniqueEntityID(raw.position_id),
        is_active: raw.is_active,
        is_email_verified: raw.is_email_verified,
        last_login: raw.last_login || undefined,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        deleted_at: raw.deleted_at,
      },
      new UniqueEntityID(raw.id),
    );
  }

  // Domain to Persistence mapping
  static toPrisma(user: User) {
    return {
      id: user.id.toValue(),
      email: user.email,
      password_hash: user.password_hash,
      first_name: user.first_name,
      last_name: user.last_name,
      department_id: user.department_id.toValue(),
      position_id: user.position_id.toValue(),
      is_active: user.is_active,
      is_email_verified: user.is_email_verified,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
    };
  }
}
```

## Pagination Implementation with Explicit Type Parameters

```typescript
import { createPaginator } from 'prisma-pagination';
import { Prisma, User as PrismaUser } from 'generated/prisma';
import { UserMapper } from '../../mappers/user-mapper';

// In repository method
async findMany(params: {
  page: number;
  perPage: number;
}): Promise<Pagination<User>> {
  const paginate = createPaginator({ perPage: params.perPage });

  // Note the explicit type parameters
  const paginatedResult = await paginate<PrismaUser, Prisma.UserFindManyArgs>(
    this.prisma.user,
    {
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    },
    {
      page: params.page,
    },
  );

  return {
    data: paginatedResult.data.map((user) => UserMapper.toDomain(user)),
    meta: paginatedResult.meta,
  };
}
``` 