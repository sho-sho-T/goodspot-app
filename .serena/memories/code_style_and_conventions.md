# Code Style and Conventions

## General TypeScript Style

### Formatting (Prettier)

- **No semicolons** (semi: false)
- **Single quotes** (singleQuote: true)
- **2-space indentation** (tabWidth: 2, useTabs: false)
- **Trailing commas** in ES5 syntax (trailingComma: "es5")
- **Line width**: 80 characters (printWidth: 80)
- **Arrow parens**: Always use parentheses (arrowParens: "always")
- **End of line**: LF (endOfLine: "lf")
- **Tailwind**: Automatic class sorting via prettier-plugin-tailwindcss

### Naming Conventions

- **React Components**: PascalCase (e.g., `UserProfile.tsx`, `TodoListContainer.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useUserProfile.ts`)
- **Files**:
  - Components: `<ComponentName>.tsx`
  - Hooks: `use<HookName>.ts`
  - Actions: `*.action.ts` (must have `'use server'`)
  - Server-only modules: `*.server.ts` (must have `import 'server-only'` in external/)
  - DTOs: `*.dto.ts`
  - Schemas: `*.schema.ts`
  - Tests: `*.test.ts` or `*.test.tsx`
- **Directories**: kebab-case or camelCase depending on context
  - Route groups: `(authenticated)`, `(guest)`
  - Features: `auth`, `playground`

### Import Organization

Imports are auto-sorted by ESLint with this order:

1. React
2. Next.js modules (next, next/\*)
3. External packages (builtin/external)
4. Internal packages:
   - `@/features/**`
   - `@/shared/**`
   - `@/external/**`
5. Relative imports (parent, sibling, index)
6. Type imports (grouped separately at the end)

**Blank lines between groups are enforced.**

Example:

```typescript
import React from 'react'

import { cookies } from 'next/headers'

import { useQuery } from '@tanstack/react-query'

import { UserProfileContainer } from '@/features/users/components/client'

import { Button } from '@/shared/components/ui'

import { getUserQuery } from '@/external/handler/users'

import { formatDate } from '../utils'

import type { User } from '@/external/domain/users'
```

### Variable Naming

- Unused variables must be prefixed with underscore: `_unusedVar`, `_event`, `_err`
- This applies to function args, variables, and caught errors

## React/Next.js Patterns

### Component Structure

Use **Container/Presenter** pattern in client components:

```
components/client/<Widget>/
├── <Widget>Container.tsx    # 'use client', manages state and hooks
├── <Widget>Presenter.tsx    # Stateless UI component
├── use<Widget>.ts           # Internal hook for component logic
└── index.ts                 # Barrel export
```

### Server Components

- Place in `components/server/<Template>/`
- No `'use client'` directive
- Handle initial data fetching
- Pass data as props to client containers

### Directives

- **Client components**: Must include `'use client'` at the top (enforced by ESLint)
- **Server Actions**: Files named `*.action.ts` must include `'use server'` (enforced by ESLint)
- **Server-only modules**: Files in `external/service/` and `external/handler/*.server.ts` must include `import 'server-only'` (enforced by ESLint)

## Architectural Constraints (Enforced by ESLint)

### Import Restrictions

1. **No direct service imports**: Features cannot import from `external/service/` directly. Must go through `external/handler/`.
2. **No action imports outside features**: `*.action.ts` files can only be imported within `src/features/`.
3. **No domain imports in UI layers**: `app/`, `features/`, and `shared/` cannot import from `external/domain/` (except in type files).
4. **External layer is server-only**: Client components cannot import from `external/`.

### Type Hints

- TypeScript is used throughout
- Explicit return types are encouraged but not strictly required
- Props interfaces should be defined for components
- Use Next.js helpers: `PageProps`, `LayoutProps` (custom rule suggests this)

## File Organization

### Index Files (Barrel Exports)

Use `index.ts` to re-export from directories:

```typescript
// features/users/components/client/UserProfile/index.ts
export { UserProfileContainer } from './UserProfileContainer'
export { UserProfilePresenter } from './UserProfilePresenter'
export { useUserProfile } from './useUserProfile'
```

### Co-located Tests

Place `*.test.tsx` files alongside the code they test within the feature directory.

## Comments and Documentation

- **No requirement for excessive comments** - code should be self-explanatory
- Use JSDoc for exported functions when the signature isn't obvious
- Avoid redundant comments that just restate the code
