# 🚨 Public Route Configuration Guide

## When creating a public endpoint, follow these three required steps:

### Step 1: Decorate Controller Method with @Public()

```typescript
import { Public } from '@/infra/auth/public'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('/my-endpoint')
export class MyController {
  constructor(private myUseCase: MyUseCase) {}

  @Public() // Important! Makes the route accessible without authentication
  @Post()
  async handle(@Body() body) {
    // Implementation
  }
}
```

### Step 2: Add Route to routes.ts Constants

Add the route constant in the appropriate domain section:

```typescript
// src/core/constants/routes.ts
export const ROUTES = {
  PUBLIC: {
    // Choose the correct domain section
    CLIENT_PROFILE: {
      MY_NEW_ENDPOINT: '/my-endpoint', // Add your route here
    },
  },
}
```

### Step 3: Register in routes-need-public-key-routes.ts

This step is crucial for public key authentication:

```typescript
// src/core/constants/routes-need-public-key-routes.ts
import { RequestMethod } from '@nestjs/common'
import { ROUTES } from './routes'

export const ROUTES_NEED_PUBLIC_KEY: RouteInfo[] = [
  // Other routes...
  {
    method: RequestMethod.POST, // Use appropriate method (POST, GET, PUT, DELETE)
    path: ROUTES.PUBLIC.CLIENT_PROFILE.MY_NEW_ENDPOINT,
  },
]
```

## ❌ Common Mistakes to Avoid

1. **Forgetting @Public() decorator**: Without this, the route will require authentication
2. **Not adding to routes.ts**: Route constants must be defined here for consistency
3. **Missing routes-need-public-key-routes.ts registration**: Routes won't be accessible with public key authentication
4. **Inconsistent path strings**: Always reference ROUTES constants, don't use string literals

## ✅ Example: Complete Public Route Implementation

```typescript
// 1. Controller with @Public() decorator
@Controller(ROUTES.PUBLIC.CLIENT_PROFILE.ACCEPT_INVESTOR_PROFILE_CREATION)
export class AcceptInvestorProfileCreationController {
  constructor(
    private nestAcceptInvestorProfileCreationUseCase: NestAcceptInvestorProfileCreationUseCase,
  ) {}

  @Public()
  @Post()
  async handle(@Body() body) {
    // Implementation
  }
}

// 2. routes.ts
export const ROUTES = {
  PUBLIC: {
    CLIENT_PROFILE: {
      ACCEPT_INVESTOR_PROFILE_CREATION: '/accept-investor-profile-creation',
    },
  },
}

// 3. routes-need-public-key-routes.ts
export const ROUTES_NEED_PUBLIC_KEY: RouteInfo[] = [
  {
    method: RequestMethod.POST,
    path: ROUTES.PUBLIC.CLIENT_PROFILE.ACCEPT_INVESTOR_PROFILE_CREATION,
  },
]
```

Remember: All three steps are required for every public endpoint!
