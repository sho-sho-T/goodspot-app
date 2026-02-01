# app/ Layer Rules

This is the **routing layer**. Keep it thin.

## DO

- Import and render Server Templates from `@/features/<domain>/components/server/`
- Handle route-specific logic only (params, searchParams)
- Use Server Components by default
- Run `npm run typegen` after adding new routes

## DON'T

- Write business logic here (belongs in features/)
- Call handlers directly (use feature templates)
- Import from `@/external/` (use features as proxy)
- Add 'use client' (routes are Server Components by default)

## IMPORTANT: Manual Directive Checks

Routes in app/ are Server Components by default (no 'use client').
If you need client interactivity, create a client component in features/ instead.

**Note:** Directive checking is not automated. Verify in code review.

## Route Groups

- `(guest)/` - Unauthenticated routes (login, register)
- `(authenticated)/` - Protected routes (require auth)
- Group layout handles auth checks via `AuthenticatedLayoutWrapper`

## Example

```tsx
// app/(authenticated)/dashboard/page.tsx
import { DashboardTemplate } from '@/features/dashboard/components/server/DashboardTemplate';

export default function DashboardPage() {
  return <DashboardTemplate />;
}
```
