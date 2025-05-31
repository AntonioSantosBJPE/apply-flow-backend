import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface UserProps {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
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
  get email() {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
    this.touch();
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

  get is_active() {
    return this.props.is_active;
  }

  set is_active(value: boolean) {
    this.props.is_active = value;
    this.touch();
  }

  get is_email_verified() {
    return this.props.is_email_verified;
  }

  set is_email_verified(value: boolean) {
    this.props.is_email_verified = value;
    this.touch();
  }

  get last_login() {
    return this.props.last_login;
  }

  set last_login(value: Date | null | undefined) {
    this.props.last_login = value;
    this.touch();
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  get deleted_at() {
    return this.props.deleted_at;
  }

  get full_name() {
    return `${this.props.first_name} ${this.props.last_name}`;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

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

  public updateLastLogin() {
    this.props.last_login = new Date();
    this.touch();
  }

  public updatePassword(passwordHash: string) {
    this.props.password_hash = passwordHash;
    this.touch();
  }
}
