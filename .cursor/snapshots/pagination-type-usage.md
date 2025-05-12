# Pagination Type Usage

## Issue

When working with pagination in the application, we noticed that some use cases and repositories were incorrectly importing the `Pagination` type, which is a global type defined in `src/domain/types/pagination.d.ts`. Additionally, controllers and presenters were incorrectly handling pagination objects.

## Solution

### 1. Repository and Use Case Pattern

The `Pagination` type is defined as an ambient declaration and should not be explicitly imported in repository interfaces or use cases. The correct approach is to simply use the type directly:

```typescript
// Correct - Don't import Pagination
abstract class SomeRepository {
  abstract listWithPagination(
    page: number,
    perPage: number,
  ): Promise<Pagination<SomeEntity>>
}
```

In use cases, return the full pagination object and not just the data and meta separately:

```typescript
// Correct
return right({
  items: paginatedResults, // Pass the entire pagination object
})

// Incorrect
return right({
  items: paginatedResults.data,
  totalCount: paginatedResults.meta.total,
  currentPage: paginatedResults.meta.current_page,
  perPage: paginatedResults.meta.per_page,
  lastPage: paginatedResults.meta.last_page,
})
```

### 2. Presenter Pattern

Presenters for paginated data should:

- Extend the `BasePresenter` class
- Accept a single parameter of type `Pagination<T>`
- Use the `safeParse` method for handling errors
- Preserve the meta object from the pagination

```typescript
// Correct
export class SomeEntityWithPaginationPresenter extends BasePresenter {
  static toHTTP(entities: Pagination<SomeEntity>) {
    return this.safeParse(
      entities,
      (data) => ({
        data: data.data.map((entity) => {
          // Map entity properties
        }),
        meta: entities.meta, // Preserve the meta object
      }),
      'SomeEntityWithPaginationPresenter',
    )
  }
}

// Incorrect
export class SomeEntityWithPaginationPresenter {
  static toHTTP(
    entities: SomeEntity[],
    totalCount: number,
    currentPage: number,
    perPage: number,
    lastPage: number,
  ) {
    // ...
  }
}
```

### 3. Controller Pattern

Controllers should:

- Pass the full pagination object to presenters
- Define proper API response schema
- Handle empty results consistently

```typescript
// Correct
if (result.isRight()) {
  return SomeEntityWithPaginationPresenter.toHTTP(
    result.value.items, // Pass the full pagination object
  )
}

// Incorrect
if (result.isRight()) {
  return SomeEntityWithPaginationPresenter.toHTTP(
    result.value.items.data,
    result.value.items.meta.total,
    result.value.items.meta.currentPage,
    result.value.items.meta.perPage,
    result.value.items.meta.lastPage,
  )
}
```

## Example Fix

We fixed this issue in `src/domain/fleet/application/use-cases/list-client-vehicle-extra-with-pagination.ts` and related files:

### 1. Use Case Fix

Before:

```typescript
import { Pagination } from '@/core/pagination' // Incorrect import

type ListClientVehicleExtraWithPaginationUseCaseResponse = Either<
  null,
  {
    clientVehicleExtras: ClientVehicleExtra[]
    totalCount: number
    currentPage: number
    perPage: number
    lastPage: number
  }
>

// ...

return right({
  clientVehicleExtras: paginatedClientVehicleExtras.data,
  totalCount: paginatedClientVehicleExtras.meta.total,
  currentPage: paginatedClientVehicleExtras.meta.current_page,
  perPage: paginatedClientVehicleExtras.meta.per_page,
  lastPage: paginatedClientVehicleExtras.meta.last_page,
})
```

After:

```typescript
// No import for Pagination

type ListClientVehicleExtraWithPaginationUseCaseResponse = Either<
  null,
  {
    clientVehicleExtras: Pagination<ClientVehicleExtra>
  }
>

// ...

return right({
  clientVehicleExtras: paginatedClientVehicleExtras,
})
```

### 2. Presenter Fix

Before:

```typescript
export class ListClientVehicleExtraWithPaginationPresenter {
  static toHTTP(
    clientVehicleExtras: ClientVehicleExtra[],
    totalCount: number,
    currentPage: number,
    perPage: number,
    lastPage: number,
  ) {
    return {
      data: clientVehicleExtras.map((clientVehicleExtra) => {
        // ...
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

After:

```typescript
export class ListClientVehicleExtraWithPaginationPresenter extends BasePresenter {
  static toHTTP(clientVehicleExtras: Pagination<ClientVehicleExtra>) {
    return this.safeParse(
      clientVehicleExtras,
      (data) => ({
        data: data.data.map((clientVehicleExtra) => {
          // ...
        }),
        meta: clientVehicleExtras.meta,
      }),
      'ListClientVehicleExtraWithPaginationPresenter',
    )
  }
}
```

### 3. Controller Fix

Before:

```typescript
if (result.isRight()) {
  return ListClientVehicleExtraWithPaginationPresenter.toHTTP(
    result.value.clientVehicleExtras,
    result.value.totalCount,
    result.value.currentPage,
    result.value.perPage,
    result.value.lastPage,
  )
}
```

After:

```typescript
if (result.isRight()) {
  return ListClientVehicleExtraWithPaginationPresenter.toHTTP(
    result.value.clientVehicleExtras,
  )
}
```

## Guidelines

1. The `Pagination` type is globally available through TypeScript's ambient declarations
2. Never import the `Pagination` type in repository interfaces
3. Use cases should return the full pagination object
4. Controllers and presenters should preserve the pagination structure for API responses
5. Presenters should extend BasePresenter and use safeParse
6. Controllers should pass the full pagination object to presenters
