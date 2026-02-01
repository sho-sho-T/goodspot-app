# shared/ Layer Rules

This is the **cross-cutting layer**. No domain knowledge.

## Purpose

Reusable UI components, utilities, and configurations used across all layers.

## Structure

```
shared/
├── components/
│   ├── layout/      # Layouts (AuthenticatedLayoutWrapper)
│   ├── ui/          # Generic UI (Button, Input, Card)
│   └── providers/   # Context providers (QueryClientProvider)
├── lib/             # Utilities (cn, zod helpers)
├── hooks/           # Generic hooks (useMediaQuery, useDebounce)
└── types/           # Shared types (not domain-specific)
```

## DO

- Keep components generic and reusable
- Accept props for customization
- Use TypeScript generics where appropriate
- Export from index.ts for clean imports

## DON'T

- Import from `@/features/` or `@/external/` (breaks layer separation)
- Add domain-specific logic (belongs in features/)
- Hardcode business rules
- Create feature-specific components here

## Example

```tsx
// shared/components/ui/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return <button className={cn(styles[variant])} onClick={onClick}>{children}</button>;
}
```
