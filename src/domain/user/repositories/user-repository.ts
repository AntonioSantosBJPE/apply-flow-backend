import { User } from '../entities/user';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findMany(params: {
    page: number;
    perPage: number;
  }): Promise<Pagination<User>>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByDepartmentId(
    departmentId: string,
    params: {
      page: number;
      perPage: number;
    },
  ): Promise<Pagination<User>>;
}
