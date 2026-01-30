# Project Overview

## Purpose
goodspot-app is a Next.js 16 web application using App Router. It appears to be a feature-rich application with authentication, data management, and a playground for experimentation.

## Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 with App Router
- **React**: Version 19.2.0
- **Styling**: Tailwind CSS 4 with custom animations (tw-animate-css)
- **UI Components**: Radix UI primitives, class-variance-authority for variants
- **State Management**: TanStack Query (React Query) v5.90.10
- **Forms**: react-hook-form v7.66.1
- **Validation**: Zod v4.1.13

### Backend/Infrastructure
- **Database**: PostgreSQL with Prisma 6
- **Authentication**: Supabase (@supabase/ssr, @supabase/supabase-js, @supabase/auth-helpers-nextjs)
- **Caching**: Prisma Accelerate (@prisma/extension-accelerate)

### Development Tools
- **Language**: TypeScript 5
- **Linter**: ESLint 9 with custom local rules
- **Formatter**: Prettier 3.6.2 with Tailwind plugin
- **Testing**: Vitest 4.0.14 with Testing Library, jsdom/happy-dom
- **Alternative Linter**: Biome 2.3.7 (installed but not primary)

## Project Structure

The codebase follows a strict layered architecture:

```
src/
├── app/           # Routing layer (thin, no business logic)
├── features/      # Domain layer (vertical slices by feature)
├── shared/        # Cross-cutting concerns (domain-agnostic)
└── external/      # Infrastructure layer (server-only, DB/API)
```

Current features in `src/features/`:
- auth
- playground
- system

External layer subdirectories:
- client/ - DB and API clients
- domain/ - Pure domain models
- dto/ - Data transfer objects with Zod schemas
- handler/ - Entry points (command/query pattern)
- service/ - Application services
- repository/ - Data persistence

## Development Environment
- **Platform**: macOS (Darwin)
- **Package Manager**: npm (package-lock.json present, also bun.lock for alternative)
- **Node Version**: Likely v20+ (based on @types/node)
