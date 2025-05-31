import { User as PrismaUser } from 'generated/prisma';
import { User } from '@/domain/user/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        password_hash: raw.password_hash,
        first_name: raw.first_name,
        last_name: raw.last_name,
        is_active: raw.is_active,
        is_email_verified: raw.is_email_verified,
        last_login: raw.last_login || undefined,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User) {
    return {
      id: user.id.toValue(),
      email: user.email,
      password_hash: user.password_hash,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
