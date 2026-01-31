# Task Completion Checklist

When a task is completed, perform these steps in order:

## 1. Format Code

```bash
npm run format
```

This runs Prettier to ensure consistent code formatting across the project.

## 2. Run Linter

```bash
npm run lint
```

This runs ESLint with custom architectural rules to check for:

- Missing `'use client'` directives
- Missing `'use server'` directives in `*.action.ts`
- Missing `import 'server-only'` in external layer
- Direct service imports (should use handlers)
- Import from `external/domain` in UI layers
- Import ordering issues

If errors occur, fix them or use:

```bash
npm run lint:fix
```

## 3. Update Route Types (if applicable)

If you added or modified routes in `src/app/`, run:

```bash
npm run typegen
```

## 4. Verify in Development Server

If the dev server is running:

- Check browser console for runtime errors
- Verify hot reload worked correctly
- Test the modified functionality manually

## 5. Check Architectural Compliance

Verify the following manually:

### If you modified features/

- Features only import from `external/handler/`, not `external/service/` or `external/repository/`
- Client components have `'use client'` directive
- Container/Presenter split is maintained
- Hooks use TanStack Query for data fetching

### If you modified external/

- Server-only files have `import 'server-only'`
- DTO validation uses Zod schemas in `external/dto/`
- Handlers separate command (write) from query (read)
- Services orchestrate business logic but don't directly handle HTTP
- Domain models are framework-agnostic (no Next.js or DB types)

### If you added Server Actions

- File is named `*.action.ts`
- Has `'use server'` directive
- Validates input with Zod schema from `external/dto/`
- Calls `*.server.ts` functions in `external/handler/`

### If you modified Prisma schema

- Schema is in `src/external/client/db/prisma/schema.prisma`
- Run `npm run migrate` to create migration
- Migration appears in `src/external/client/db/prisma/migrations/`
- Update related DTOs in `external/dto/`

## 6. Consider Tests

While no test script is currently wired, if you're adding tests:

- Place `*.test.tsx` files alongside the components they test
- Use Vitest + Testing Library
- Add a test script to `package.json` when ready

## 7. Commit Message Style

When committing, use concise imperative messages:

- Good: "Add user profile component"
- Good: "Fix: session timeout handling"
- Good: "Refactor auth flow for clarity"
- Avoid: "Updated some files"
- Japanese messages are acceptable but should be equally clear

## 8. Git Workflow

This project is on the `main` branch. When ready to commit:

- Stage relevant files: `git add <files>`
- Commit: `git commit -m "message"`
- Do not push unless explicitly requested
