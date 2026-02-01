# features/ Layer Rules

This is the **domain layer**. Each feature is self-contained.

## Structure

```
features/<domain>/
├── components/
│   ├── server/<Template>/     # Server Components (fetch initial data)
│   └── client/<Widget>/       # Client Components (Container + Presenter)
├── hooks/                     # TanStack Query hooks (use<Domain>.ts)
└── types/                     # Feature-specific types
```

## DO

- Import handlers from `@/external/handler/<domain>/`
- Import DTOs from `@/external/dto/<domain>/`
- Use Container/Presenter pattern for client components
- Server Templates fetch initial data, pass to Containers
- Containers call hooks, pass props to Presenters
- Presenters are stateless UI only

## DON'T

- Import from `@/external/service/` or `@/external/repository/` (use handlers)
- Import from `@/external/domain/` (allowed only in type files)
- Mix client state logic in Presenters
- Call Server Actions directly in components (use hooks)

## IMPORTANT: Directive Requirements

- **Client components** in `/client/` directories → MUST have `'use client'` at top
- **Server actions** in `*.action.ts` files → MUST have `'use server'` at top
- **Server-only files** (handlers, services) → MUST have `import 'server-only'`

**Note:** These are not auto-checked by linter. Verify manually or in code review.

## Example

```tsx
// components/server/UserProfileTemplate/UserProfileTemplate.tsx
import { getUserProfile } from '@/external/handler/user/query.action';
import { UserProfileContainer } from '../../client/UserProfile';

export async function UserProfileTemplate() {
  const profile = await getUserProfile();
  return <UserProfileContainer initialData={profile} />;
}

// components/client/UserProfile/UserProfileContainer.tsx
'use client';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { UserProfilePresenter } from './UserProfilePresenter';

export function UserProfileContainer({ initialData }) {
  const { data, isLoading } = useUserProfile(initialData);
  return <UserProfilePresenter data={data} isLoading={isLoading} />;
}
```
