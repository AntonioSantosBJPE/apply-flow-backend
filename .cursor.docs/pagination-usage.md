# Pagination Type Usage

## Overview

The `Pagination` type is a globally defined type in the `src/domain/types/pagination.d.ts` file. It represents the standard pagination structure used throughout the application.

## Definition

```typescript
type Pagination<T> = {
  data: T[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}
```

## Usage Guidelines

### DO NOT Import the Pagination Type in Repository Interfaces

The `Pagination` type is globally available through TypeScript's ambient declarations. In repository interfaces that return paginated results:

✅ **Correct Usage**:

```typescript
abstract class SomeRepository {
  abstract listWithPagination(
    page: number,
    perPage: number,
  ): Promise<Pagination<SomeEntity>>
}
```

❌ **Incorrect Usage**:

```typescript
import { Pagination } from '@/core/pagination' // DON'T DO THIS

abstract class SomeRepository {
  abstract listWithPagination(
    page: number,
    perPage: number,
  ): Promise<Pagination<SomeEntity>>
}
```

### Use in Use Cases

When implementing use cases that deal with paginated data:

1. Return the full `Pagination<T>` object in the response:

```typescript
type SomeUseCaseResponse = Either<
  null,
  {
    items: Pagination<SomeEntity> // Return the entire pagination object
  }
>
```

2. When consuming paginated results from repositories, pass the entire object:

```typescript
const paginatedResults = await this.repository.listWithPagination(page, perPage)

return right({
  items: paginatedResults, // Pass the entire pagination object
})
```

### Presenter Pattern for Pagination

Presenters for paginated data should:

1. Extend the `BasePresenter` class to use error handling
2. Accept a full `Pagination<T>` object as input
3. Use the `safeParse` method to transform the data
4. Preserve the meta information as is

✅ **Correct Presenter Implementation**:

```typescript
export class SomeEntityWithPaginationPresenter extends BasePresenter {
  static toHTTP(entities: Pagination<SomeEntity>) {
    return this.safeParse(
      entities,
      (data) => ({
        data: data.data.map((entity) => {
          return {
            // Map entity properties
            id: entity.id.toNumber(),
            name: entity.name,
            // Other properties...
          }
        }),
        meta: entities.meta, // Preserve the meta object as is
      }),
      'SomeEntityWithPaginationPresenter',
    )
  }
}
```

❌ **Incorrect Presenter Implementation**:

```typescript
export class SomeEntityWithPaginationPresenter {
  static toHTTP(
    entities: SomeEntity[],
    totalCount: number,
    currentPage: number,
    perPage: number,
    lastPage: number,
  ) {
    return {
      data: entities.map((entity) => {
        // Map entity properties
      }),
      meta: {
        total: totalCount,
        current_page: currentPage,
        per_page: perPage,
        last_page: lastPage,
      },
    }
  }
}
```

### Controller Pattern for Pagination

Controllers for paginated data should:

1. Use pagination presenters correctly
2. Pass the full pagination object to presenters
3. Define appropriate API response schema including meta information
4. Handle empty results with consistent structure

✅ **Correct Controller Implementation**:

```typescript
@Get()
@ApiOkResponse({
  schema: {
    allOf: [
      {
        properties: {
          data: {
            type: 'array',
            items: {
              // Schema for your entity
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              lastPage: { type: 'number' },
              currentPage: { type: 'number' },
              perPage: { type: 'number' },
              prev: { type: 'number', nullable: true },
              next: { type: 'number', nullable: true },
            },
          },
        },
      },
    ],
  },
})
async handle(@Query() query) {
  const result = await this.useCase.execute({
    page: query.page,
    perPage: query.perPage,
    // Other parameters...
  })

  if (result.isRight()) {
    return SomeEntityWithPaginationPresenter.toHTTP(
      result.value.items, // Pass the full pagination object
    )
  }

  // Consistent empty results structure
  return {
    data: [],
    meta: {
      total: 0,
      current_page: query.page,
      per_page: query.perPage,
      last_page: 1,
    },
  }
}
```

❌ **Incorrect Controller Implementation**:

```typescript
@Get()
async handle(@Query() query) {
  const result = await this.useCase.execute({
    page: query.page,
    perPage: query.perPage,
  })

  if (result.isRight()) {
    return SomeEntityWithPaginationPresenter.toHTTP(
      result.value.items.data,
      result.value.items.meta.total,
      result.value.items.meta.currentPage,
      result.value.items.meta.perPage,
      result.value.items.meta.lastPage,
    )
  }
}
```

## Repository Implementation

When implementing repository methods that return paginated results, use the `createPaginator` function from `prisma-pagination` to generate compliant pagination objects:

```typescript
import { createPaginator } from 'prisma-pagination'

// In repository implementation:
async listWithPagination(page: number, perPage: number): Promise<Pagination<Entity>> {
  const paginate = createPaginator({ perPage })

  return paginate(
    this.prisma.entity,
    {
      where: { /* your conditions */ },
      orderBy: { /* your ordering */ },
    },
    {
      page,
    }
  )
}
```
