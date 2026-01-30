# Suggested Commands

## Development Server
```bash
npm run dev
```
Starts the Next.js development server on http://localhost:3000. The page auto-reloads on file changes.

## Building and Production
```bash
npm run build      # Create production build
npm run start      # Serve production build
```

## Linting and Formatting
```bash
npm run lint              # Lint entire project with ESLint (includes custom rules)
npm run lint:src          # Lint only src/ directory
npm run lint:fix          # Auto-fix ESLint issues in entire project
npm run lint:fix:src      # Auto-fix ESLint issues in src/ only
npm run format            # Format code with Prettier
npm run format:check      # Check formatting without modifying files
```

## Database Operations
```bash
npm run migrate          # Run Prisma migrations (development)
npm run migrate:reset    # Reset database and rerun all migrations
npm run prisma:studio    # Open Prisma Studio GUI for database inspection
```

## Type Generation
```bash
npm run typegen
```
Generate Next.js route types. **Must be run after adding new routes** in `src/app/`.

## Darwin-Specific System Commands
Since the project runs on Darwin (macOS), standard BSD commands apply:
- `ls -la` - List files with details
- `find . -name "pattern"` - Find files (use Glob tool instead when possible)
- `grep -r "pattern" .` - Search in files (use Grep tool instead when possible)
- `git` commands work as expected

## After Completing Tasks
Always run in this order:
1. `npm run format` - Ensure code formatting
2. `npm run lint` - Check for architectural violations and code issues
3. `npm run typegen` - Update route types if routes were added/modified
4. Verify no console errors in dev server
