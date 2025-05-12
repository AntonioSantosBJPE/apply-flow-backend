# Pagination Usage Checklist

When implementing features that use pagination, check the following to ensure you're following best practices:

## Repository Interface Definition

- [ ] Repository interface methods for paginated results should return `Promise<Pagination<EntityType>>`
- [ ] Do **NOT** import the `Pagination` type in repository interface files
- [ ] Ensure the repository has parameters for pagination (typically `page` and `perPage`)

## Use Case Implementation

- [ ] Use cases that work with paginated data should return the full pagination object in their response
- [ ] Response type should use `Pagination<EntityType>` without importing it
- [ ] Do not destructure the pagination object in the return statement, pass it directly

## Repository Implementation

- [ ] Use `createPaginator` from `prisma-pagination` to implement pagination
- [ ] Ensure pagination respects the standard structure with `data` and `meta` properties
- [ ] Return the complete pagination object from repository methods

## Presenter Implementation

- [ ] Extend the `BasePresenter` class for all pagination presenters
- [ ] Accept a single `Pagination<EntityType>` parameter in the `toHTTP` method
- [ ] Use the `safeParse` method to handle error cases
- [ ] Preserve the meta information structure from the Pagination object
- [ ] Transform only the entity data without modifying the pagination structure
- [ ] Do NOT accept separate parameters for data and pagination metadata

## Controller Implementation

- [ ] Define proper API response schema with `@ApiOkResponse` decorator
- [ ] Include both `data` and `meta` structures in the API response schema
- [ ] Pass the full pagination object from the use case result to the presenter
- [ ] Use a single presenter parameter (`result.value.items`) not multiple parameters
- [ ] Handle empty results with a consistent structure (empty array and pagination meta)
- [ ] Do NOT destructure the pagination object before passing to the presenter

## Example of Correct Pattern

**Repository Interface**:

```typescript
// No import for Pagination
abstract class ExampleRepository {
  abstract listWithPagination(
    page: number,
    perPage: number,
  ): Promise<Pagination<SomeEntity>>
}
```

**Use Case**:

```typescript
// No import for Pagination
type ExampleUseCaseResponse = Either<
  null,
  {
    items: Pagination<SomeEntity>
  }
>

// In execute method:
const paginatedItems = await this.repository.listWithPagination(page, perPage)

return right({
  items: paginatedItems,
})
```

**Presenter**:

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

**Controller**:

```typescript
@Get()
@ApiOkResponse({
  schema: {
    allOf: [
      {
        properties: {
          data: {
            type: 'array',
            items: { /* schema for your entity */ }
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
  const result = await this.someUseCase.execute({
    page: query.page,
    perPage: query.perPage,
  })

  if (result.isRight()) {
    return SomeEntityPresenter.toHTTP(
      result.value.items, // Pass the FULL pagination object
    )
  }

  // Consistent empty response
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

**Repository Implementation**:

```typescript
import { createPaginator } from 'prisma-pagination'

async listWithPagination(page: number, perPage: number): Promise<Pagination<SomeEntity>> {
  const paginate = createPaginator({ perPage })

  return paginate(
    this.prisma.someEntity,
    {
      where: { /* conditions */ },
      orderBy: { created_at: 'desc' },
    },
    { page }
  )
}
```

**Common Errors to Avoid**:

1. Importing the Pagination type:

```typescript
import { Pagination } from '@/core/pagination' // DON'T DO THIS
```

2. Destructuring pagination in use case response:

```typescript
// DON'T DO THIS
return right({
  items: paginatedItems.data,
  totalCount: paginatedItems.meta.total,
  currentPage: paginatedItems.meta.current_page,
  // etc.
})
```

3. Accepting multiple parameters in presenter:

```typescript
// DON'T DO THIS
static toHTTP(
  entities: SomeEntity[],
  totalCount: number,
  currentPage: number,
  perPage: number,
  lastPage: number,
) {
  // ...
}
```

4. Passing multiple parameters to presenter in controller:

```typescript
// DON'T DO THIS
return SomeEntityPresenter.toHTTP(
  result.value.items.data,
  result.value.items.meta.total,
  result.value.items.meta.currentPage,
  result.value.items.meta.perPage,
  result.value.items.meta.lastPage,
)
```
