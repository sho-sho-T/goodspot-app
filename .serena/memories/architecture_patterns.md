# Architecture Patterns

## Layered Architecture

This project uses a strict layered architecture with clear boundaries:

```
┌─────────────────┐
│   src/app/      │  Routing Layer (thin)
└────────┬────────┘
         │
┌────────▼────────┐
│ src/features/   │  Domain Layer (feature slices)
└────────┬────────┘
         │
┌────────▼────────┐
│ src/external/   │  Infrastructure Layer (server-only)
└─────────────────┘
         ▲
         │ (horizontal)
┌────────┴────────┐
│  src/shared/    │  Cross-cutting concerns
└─────────────────┘
```

**Dependency Rule**: Outer layers depend on inner layers. `app/` → `features/` → `external/`. The `shared/` layer can be used by all.

## External Layer: Command/Query Separation

The `external/` layer separates reads from writes:

```
external/handler/<domain>/
├── command.server.ts      # Write operations (import 'server-only')
├── command.action.ts      # Server Actions for writes ('use server')
├── query.server.ts        # Read operations (import 'server-only')
└── query.action.ts        # Server Actions for reads ('use server')
```

- **Commands**: Mutate state (create, update, delete)
- **Queries**: Read state (get, list, search)

This follows CQRS principles at the handler level.

## Data Flow Pattern

### Reading Data
```
app/page.tsx
  → features/<domain>/components/server/<Template>.tsx
      → features/<domain>/hooks/query/use<Query>.ts (TanStack Query)
          → external/handler/<domain>/query.action.ts ('use server')
              → external/handler/<domain>/query.server.ts
                  → external/service/<domain>/<Service>.ts
                      → external/repository/db/<Repository>.ts
                          → external/client/db/client.ts (Prisma)
```

### Writing Data
```
features/<domain>/components/client/<Widget>Container.tsx
  → features/<domain>/hooks/mutation/use<Mutation>.ts (TanStack Query)
      → external/handler/<domain>/command.action.ts ('use server')
          → external/handler/<domain>/command.server.ts
              → external/dto/<domain>/<dto>.command.dto.ts (Zod validation)
              → external/service/<domain>/<Service>.ts
                  → external/repository/db/<Repository>.ts
                      → external/client/db/client.ts (Prisma)
```

**Key points**:
- All external data must be validated via Zod schemas in `external/dto/`
- Features never call services/repositories directly
- Handlers are the only entry point to the external layer

## Domain-Driven Design Elements

### Domain Organization
Each domain gets parallel directories:
```
domain/<domain>/           # Pure models, interfaces
dto/<domain>/              # Zod schemas, DTOs
handler/<domain>/          # Command/query handlers
service/<domain>/          # Application services
repository/db/<Domain>Repository.ts  # Persistence
```

### Domain Layer Structure
```
domain/<domain>/
├── <domain>.ts                   # Aggregate/Entity
├── <domain>-id.ts                # Value Object for ID
├── <domain>.repository.ts        # Repository interface
├── events/                       # Domain events (optional)
└── specifications/               # Business rules (optional)
```

Domain models are **framework-agnostic**: no Next.js, Prisma, or DB types.

## React Patterns

### Container/Presenter Split
Client components separate concerns:

**Container** (`<Widget>Container.tsx`):
- Has `'use client'` directive
- Calls custom hooks (TanStack Query)
- Manages local state
- Handles events
- Passes props to Presenter

**Presenter** (`<Widget>Presenter.tsx`):
- Pure function component
- No hooks (except maybe useId for accessibility)
- No state management
- Only receives props and renders UI
- Easily unit testable

**Custom Hook** (`use<Widget>.ts`):
- Encapsulates component-specific logic
- Returns state and callbacks for Container
- Can use other hooks internally

### Server Templates
```typescript
// features/users/components/server/UserListPageTemplate/UserListPageTemplate.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/shared/lib/query-client'
import { getUsersQuery } from '@/external/handler/users'

export async function UserListPageTemplate() {
  const queryClient = getQueryClient()
  
  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => getUsersQuery(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserListContainer />
    </HydrationBoundary>
  )
}
```

Server templates:
- Are Server Components (no `'use client'`)
- Prefetch data using TanStack Query
- Use HydrationBoundary to pass data to client
- Render the Container component

## Authentication Pattern

### Route Groups
```
app/
├── (guest)/          # Public routes (login, signup)
├── (authenticated)/  # Protected routes
└── (neutral)/        # Routes accessible to all
```

### Auth Guard in Layout
```typescript
// app/(authenticated)/layout.tsx
import { AuthenticatedLayoutWrapper } from '@/shared/components/layout/server'

export default function AuthenticatedLayout({ children }) {
  return <AuthenticatedLayoutWrapper>{children}</AuthenticatedLayoutWrapper>
}
```

The `AuthenticatedLayoutWrapper`:
- Calls `requireAuthServer()` to check session
- Redirects to login if not authenticated
- Renders layout (Header, Sidebar) if authenticated
- Pages under this route don't need individual auth checks

### Auth Utilities
```
features/auth/servers/
├── session.server.ts      # Single source of session retrieval
└── redirect.server.ts     # Auth-based redirect logic
```

- `getSessionServer()`: Returns current session or null
- `requireAuthServer()`: Redirects to login if no session
- `redirectIfAuthenticatedServer()`: Redirects to dashboard if logged in

## DTO Pattern

All external data uses Zod validation:

```typescript
// external/dto/users/users.command.dto.ts
import { z } from 'zod'

export const CreateUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>

export const CreateUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  createdAt: z.date(),
})

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>
```

Handlers validate input before processing:
```typescript
// external/handler/users/command.server.ts
import 'server-only'
import { CreateUserInputSchema } from '@/external/dto/users'

export async function createUserCommand(input: unknown) {
  const validated = CreateUserInputSchema.parse(input)
  // ... call service
}
```

## Testing Pattern

While not fully configured, the intended pattern:
- Unit tests co-located with features: `features/<domain>/**/*.test.tsx`
- Use Vitest + Testing Library
- Test Presenters for UI rendering
- Test hooks for logic
- Mock handlers in feature tests
- Test services and repositories separately in `external/`

## Import Path Aliases

Use `@/` for absolute imports:
- `@/features/**` - Feature slices
- `@/shared/**` - Shared utilities and UI
- `@/external/**` - Infrastructure layer
- `@/app/**` - Routing (rarely imported)

Avoid relative imports across layers (`../../../`).
