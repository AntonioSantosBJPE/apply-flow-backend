# Presenter and Controller Pagination Pattern

## Issue

We found inconsistencies in how controllers and presenters handle paginated data. The main issues were:

1. Presenters accepting multiple parameters (data array, total, current page, etc.) instead of a single Pagination object
2. Controllers passing destructured pagination data to presenters
3. Missing proper API response schema definitions
4. Lack of error handling in presenters

## Solution

We standardized the pattern for handling pagination in controllers and presenters.

### Presenter Pattern

All presenters that handle paginated data should:

1. Extend the `BasePresenter` class to utilize error handling
2. Accept a single parameter of type `Pagination<T>`
3. Use the `safeParse` method to handle errors gracefully
4. Preserve the meta structure from the pagination object

```typescript
export class SomeEntityWithPaginationPresenter extends BasePresenter {
  static toHTTP(entities: Pagination<SomeEntity>) {
    return this.safeParse(
      entities,
      (data) => ({
        data: data.data.map((entity) => {
          // Map entity properties
          return {
            id: entity.id.toNumber(),
            name: entity.name,
            // Other properties...
          }
        }),
        meta: entities.meta, // Preserve the meta object
      }),
      'SomeEntityWithPaginationPresenter',
    )
  }
}
```

### Controller Pattern

Controllers that handle paginated data should:

1. Define proper API response schema using `@ApiOkResponse`
2. Pass the full pagination object to presenters (not destructured)
3. Handle empty results with a consistent structure

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

## Example Fix

We fixed this issue in multiple files, such as the fleet module's client vehicle extra pagination.

### Presenter Fix (list-client-vehicle-extra-with-pagination-presenter.ts)

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
        return {
          id: clientVehicleExtra.id.toNumber(),
          // Other properties...
        }
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
import { BasePresenter } from '../base-presenter'

export class ListClientVehicleExtraWithPaginationPresenter extends BasePresenter {
  static toHTTP(clientVehicleExtras: Pagination<ClientVehicleExtra>) {
    return this.safeParse(
      clientVehicleExtras,
      (data) => ({
        data: data.data.map((clientVehicleExtra) => {
          return {
            id: clientVehicleExtra.id.toNumber(),
            // Other properties...
          }
        }),
        meta: clientVehicleExtras.meta,
      }),
      'ListClientVehicleExtraWithPaginationPresenter',
    )
  }
}
```

### Controller Fix (list-client-vehicle-extra-with-pagination.controller.ts)

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

1. Always extend `BasePresenter` for pagination presenters
2. Accept a single pagination object in presenter methods
3. Use `safeParse` for error handling in presenters
4. Pass the complete pagination object to presenters in controllers
5. Define proper API response schema in controllers
6. Handle empty results consistently
