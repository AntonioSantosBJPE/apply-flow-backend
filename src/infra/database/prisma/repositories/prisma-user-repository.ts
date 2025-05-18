import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRepository } from '@/domain/user/repositories/user-repository';
import { User } from '@/domain/user/entities/user';
import { UserMapper } from '../../mappers/user-mapper';
import { createPaginator } from 'prisma-pagination';
import { Prisma, User as PrismaUser } from 'generated/prisma';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findMany(params: {
    page: number;
    perPage: number;
  }): Promise<Pagination<User>> {
    const paginate = createPaginator({ perPage: params.perPage });

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

  async create(user: User): Promise<void> {
    const data = UserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByDepartmentId(
    departmentId: string,
    params: {
      page: number;
      perPage: number;
    },
  ): Promise<Pagination<User>> {
    const paginate = createPaginator({ perPage: params.perPage });

    const paginatedResult = await paginate<PrismaUser, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        where: {
          department_id: departmentId,
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
}
