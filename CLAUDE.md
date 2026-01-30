# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
- `npm run dev` - Start Next.js development server (http://localhost:3000)
- `npm run build` - Production build
- `npm start` - Serve production build

### Code Quality
- `npm run lint` - Run ESLint (includes custom architectural rules)
- `npm run lint:src` - Lint only src/ directory
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without modifying

### Database
- `npm run migrate` - Run Prisma migrations (dev)
- `npm run migrate:reset` - Reset database and run migrations
- `npm run prisma:studio` - Open Prisma Studio GUI

### Type Generation
- `npm run typegen` - Generate Next.js route types (run after adding new routes in src/app)

## Architecture

This is a Next.js 16 App Router project with a strict layered architecture enforcing separation of concerns.

### Layer Overview

```
src/
├── app/           # Routing layer - URLs map to pages
├── features/      # Domain layer - feature slices with UI and logic
├── shared/        # Cross-cutting UI and utilities (no domain knowledge)
└── external/      # Infrastructure layer (server-only)
```

**Dependency flow**: app → features → external. The `shared/` layer is imported horizontally by all layers. `external/` must never import from `app/` or `features/`.

### Core Principles

1. **Thin routing layer**: `src/app/page.tsx` files should only call feature templates, no business logic
2. **Feature isolation**: Each feature in `src/features/` contains its complete UI, hooks, and types
3. **Server-only infrastructure**: `src/external/` uses `import 'server-only'` and is never imported by client components
4. **DTO validation**: All external data must be validated via Zod schemas in `src/external/dto/`
5. **Handler-based access**: Features call handlers in `src/external/handler/`, never services or repositories directly

### External Layer Structure

The `src/external/` directory is organized into:

- `client/` - Low-level DB and API clients
- `domain/` - Pure domain models and repository interfaces (framework-agnostic)
- `dto/` - Zod schemas and data transfer objects
- `handler/` - Entry points for features (command/query separation)
- `service/` - Application services and orchestration
- `repository/` - Repository implementations

**Data flow**: features → handler/*.action.ts → handler/*.server.ts → service → repository → client/db

### Component Patterns

Features use Container/Presenter separation:

```
features/<domain>/components/
├── server/
│   └── <Template>/
│       └── <Template>.tsx    # Server Component, fetches initial data
└── client/
    └── <Widget>/
        ├── <Widget>Container.tsx   # 'use client', manages state/hooks
        ├── <Widget>Presenter.tsx   # Stateless UI
        └── use<Widget>.ts          # Custom hook for internal logic
```

**Server templates** fetch initial data and pass to client Containers. **Containers** call hooks (TanStack Query) and pass props to **Presenters**, which render pure UI.

### Authentication

- Route groups in `src/app/` control access: `(guest)`, `(authenticated)`
- `AuthenticatedLayoutWrapper` in `src/shared/components/layout/server/` handles auth checks
- Session logic lives in `src/features/auth/servers/session.server.ts`
- Redirect logic in `src/features/auth/servers/redirect.server.ts`

### ESLint Custom Rules

The project enforces architecture via ESLint:

- `use-client-check` - Requires `'use client'` in client components
- `use-server-check` - Requires `'use server'` in *.action.ts files
- `require-server-only` - Requires `import 'server-only'` in external/service and external/handler/*.server.ts
- `restrict-service-imports` - Prevents direct service imports (use handlers)
- `restrict-action-imports` - Prevents action imports outside features
- `no-external-domain-imports` - Prevents `external/domain` imports in app/features/shared (allowed in external/ and type files)
- Import ordering: React/Next → external packages → @/features → @/shared → @/external → relative imports

### Database

- Prisma schema: `src/external/client/db/prisma/schema.prisma`
- Migrations: `src/external/client/db/prisma/migrations/`
- Configuration: `prisma.config.ts` (not the default location)

## Workflow for Adding a Feature

See `docs/develop_workflow.md` for the full process:

1. **Define routes and data**:
   - Create route directory in `src/app/`
   - Define Zod schemas in `src/external/dto/<domain>/`
   - Implement handlers in `src/external/handler/<domain>/`

2. **Build UI**:
   - Create Server Template in `src/features/<domain>/components/server/`
   - Create Container and Presenter in `src/features/<domain>/components/client/`
   - Container calls hooks from `src/features/<domain>/hooks/`

3. **Connect**:
   - `src/app/<route>/page.tsx` imports and renders the Server Template
   - Run `npm run typegen` to update route types

4. **Verify**:
   - Run `npm run lint` to check for architectural violations
   - Ensure Server Actions go through the external layer
   - Confirm DTO validation is applied

## Key Files

- `docs/001_application_architecture/src-architecture.md` - Detailed layer descriptions
- `docs/001_application_architecture/directory_structure.md` - Japanese architecture overview
- `src/external/README.md` - External layer patterns
- `AGENTS.md` - Previous repository guidelines (partially superseded by this file)
