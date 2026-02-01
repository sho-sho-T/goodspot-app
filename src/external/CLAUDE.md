# external/ Layer Rules

This is the **infrastructure layer**. Server-only.

## Critical Rules

- ALL files require `import 'server-only'` (except `*.action.ts` which use `'use server'`)
- NEVER import from `@/app/` or `@/features/`
- Features ONLY import from `handler/` and `dto/`

## Layer Flow

```
handler/*.action.ts ('use server')
  → handler/*.server.ts (validation, auth, DTO conversion)
    → service/* (use cases, orchestration)
      → repository/* (DB operations)
        → client/db/* (Prisma client)
```

## Files by Directory

### `handler/<domain>/`
- `command.action.ts` - Server Actions for mutations (`'use server'`)
- `query.action.ts` - Server Actions for reads (`'use server'`)
- `command.server.ts` - Entry point: validate, authorize, call service (`import 'server-only'`)
- `query.server.ts` - Read operations (`import 'server-only'`)
- `shared.ts` - DTO mapping and service wiring

### `service/<domain>/`
- `<Domain>Service.ts` - Use case logic (`import 'server-only'`)
- Call repositories, orchestrate workflows
- Return domain models (not DTOs)

### `repository/db/`
- `<Domain>Repository.ts` - Implement domain repository interface
- Use Prisma client, convert to domain models

### `dto/<domain>/`
- `*.command.dto.ts` - Zod schemas + types for mutations
- `*.query.dto.ts` - Zod schemas + types for reads
- `*.dto.ts` - Response DTOs for features

### `domain/<domain>/`
- Pure domain models (NO framework dependencies)
- `*.repository.ts` - Repository interfaces
- `*-id.ts` - Value objects

## Validation Example

```ts
// handler/user/command.server.ts
import 'server-only';
import { createUserSchema } from '@/external/dto/user/user.command.dto';

export async function createUserCommand(input: unknown) {
  const validated = createUserSchema.parse(input); // Zod validation
  // authorize, call service, map to DTO
}
```

See README.md for full architecture details.
