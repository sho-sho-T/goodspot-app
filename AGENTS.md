# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router routes/layouts; pages should stay thin and call feature templates (route groups like `(guest)` exist).
- `src/features`: vertical slices per feature; `components/server` templates plus `components/client` container/presenter, with hooks/actions/types alongside.
- `src/shared`: shared UI and utilities without domain logic.
- `src/external`: infrastructure. Prisma schema/migrations live in `src/external/db/prisma`, Supabase clients/middleware in `src/external/supabase`; DTO/handlers/services also belong here when added.
- `public`: static assets. `docs`: architecture and workflow references.

## Build, Test, and Development Commands
- `npm run dev`: start the Next.js dev server.
- `npm run build`: production build. `npm run start`: serve the build.
- `npm run lint` / `npm run format`: ESLint + Prettier.
- `npm run typegen`: update Next.js route types after adding routes.
- `npm run migrate` / `npm run migrate:reset`: Prisma migrations. `npm run prisma:studio`: Prisma Studio.

## Coding Style & Naming Conventions
- TypeScript + React (Next.js App Router). Use the `@/*` path alias for internal imports.
- Formatting is enforced by Prettier (`npm run format`); indentation and quotes follow Prettier defaults.
- ESLint local rules require `use client`/`use server`, `server-only` in external services, and ordered imports (`@/features` → `@/shared` → `@/external`).
- Naming: React components `PascalCase.tsx`, hooks `useThing.ts`, route folders in `src/app`.

## Testing Guidelines
- No `test` script is wired yet. If you add tests, prefer Vitest + Testing Library and name files `*.test.ts(x)` or `*.spec.ts(x)` near the feature.
- Add a `test` script to `package.json` and update this document with run instructions.

## Architecture & Workflow Notes
- Follow `docs/develop_workflow.md`: define routes + DTO/handlers, build feature templates, then run `npm run typegen` and `npm run lint`.
- Keep `src/app` free of business logic; place logic in `src/features` and infrastructure in `src/external`.

## Commit & Pull Request Guidelines
- Commit messages are short and imperative (e.g., “Update …”, “Refactor”, “Fix: …”); Japanese messages are also used—keep them clear.
- PRs should include a concise summary, testing notes, and screenshots for UI changes.
- If Prisma schema changes, include a migration under `src/external/db/prisma/migrations` and call out DB impact.
