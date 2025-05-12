# 🚨 Controller and Use Case Registration Guide

## How to Correctly Register a Controller and Use Case

### Step 1: Create the Domain Use Case

```typescript
// src/domain/client/application/use-cases/my-use-case.ts
export class MyUseCase {
  constructor(
    private repository1: Repository1,
    private repository2: Repository2,
  ) {}

  async execute(input: Input): Promise<Output> {
    // Implementation
  }
}
```

### Step 2: Create the NestJS Injectable Use Case

```typescript
// src/infra/http/injectable-use-cases/client/nest-my-use-case.ts
import { Injectable } from '@nestjs/common'
import { Repository1 } from '@/domain/client/application/repositories/repository1'
import { Repository2 } from '@/domain/client/application/repositories/repository2'
import { MyUseCase } from '@/domain/client/application/use-cases/my-use-case'

@Injectable()
export class NestMyUseCase extends MyUseCase {
  constructor(repository1: Repository1, repository2: Repository2) {
    super(repository1, repository2)
  }
}
```

### Step 3: Create the Controller

```typescript
// src/infra/http/controllers/client/my-controller.ts
import { Controller, Post, Body } from '@nestjs/common'
import { NestMyUseCase } from '@/infra/http/injectable-use-cases/client/nest-my-use-case'

@Controller('/my-endpoint')
export class MyController {
  constructor(private nestMyUseCase: NestMyUseCase) {}

  @Post()
  async handle(@Body() body) {
    const result = await this.nestMyUseCase.execute(body)

    // Error handling and response
    return result
  }
}
```

### Step 4: Register in the Correct Module

```typescript
// src/infra/http/http-modules/modules/client.module.ts
@Module({
  imports: [DependenciesModule], // Important! Provides access to repositories
  controllers: [
    // Other controllers...
    MyController,
  ],
  providers: [
    // Other providers...
    NestMyUseCase,
  ],
})
export class ClientModule {}
```

## ⚠️ Common Issues and Solutions

### 1. Dependency Not Found Error

**Error:**

```
Error: Nest can't resolve dependencies of the NestMyUseCase (?, Repository2).
Please make sure that the argument Repository1 at index [0] is available in the Module context.
```

**Solution:**

- Verify that the module imports `DependenciesModule`
- Use the repository interface (e.g., `Repository1`) instead of the concrete implementation (e.g., `PrismaRepository1`)
- Maintain the same parameter order as the base class in the derived class constructor

### 2. Incorrect Parameter Order

**Correct Usage:**

```typescript
// Base class
export class MyUseCase {
  constructor(
    private repository1: Repository1,
    private repository2: Repository2,
  ) {}
}

// Injectable class
export class NestMyUseCase extends MyUseCase {
  constructor(
    repository1: Repository1, // Same order as in base class
    repository2: Repository2, // Same order as in base class
  ) {
    super(repository1, repository2)
  }
}
```

### 3. Using Concrete Implementations Instead of Interfaces

**Wrong:**

```typescript
constructor(
  prismaRepository: PrismaRepository,
  tokenVerify: JwtVerify,
) {}
```

**Correct:**

```typescript
constructor(
  repository: Repository, // Abstract interface
  tokenVerify: TokenVerify, // Abstract interface
) {}
```

## 🔍 How to Debug Dependency Injection Issues

1. Verify that all dependencies are exported from the correct module
2. Confirm that the module imports `DependenciesModule`
3. Check the parameter order in the constructor
4. Use abstract interfaces, not concrete implementations
