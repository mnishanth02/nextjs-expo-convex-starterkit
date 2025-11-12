# Copilot Instructions

## Architecture Overview

This is a Turborepo monorepo with a unified full-stack architecture:

- **`apps/web/`** - Next.js 16 App Router with React 19, Tailwind CSS 4, and TypeScript
- **`apps/native/`** - Expo 54 mobile app with React Native 0.81
- **`packages/backend/`** - Convex backend (serverless functions and real-time database)
- **`packages/config/`** - Shared TypeScript configurations

**Key Integration:** Both web and native apps consume the same Convex backend (`@repo/backend`) via workspace dependencies. The backend is the single source of truth for all data and authentication.

## Development Workflow

### Starting Development

```bash
# Full stack (all apps + backend)
pnpm dev

# Individual apps (recommended for focused work)
pnpm dev:web       # Next.js on :3000
pnpm dev:native    # Expo with metro bundler
pnpm dev:server    # Convex backend only
```

**First-time setup:** Run `pnpm dev:setup` to configure Convex and create `packages/backend/.env.local` with deployment credentials.

### Convex Backend Structure

Backend code lives in `packages/backend/convex/`:
- Convex requires `.ts` files in this directory
- Functions export `query`, `mutation`, or `httpAction` from `./_generated/server`
- The `_generated/` folder is auto-generated - never edit manually
- HTTP routes defined in `http.ts` using `httpRouter()`
- Database schema is inferred from mutations (no migrations)

**Important:** Convex functions must be pure - no Node.js APIs, no file system access. Use `ctx.db` for database, `ctx.auth` for authentication.

## Authentication Pattern (Better Auth + Convex)

Authentication uses `@convex-dev/better-auth` with a specific integration pattern:

1. **Backend (`packages/backend/convex/auth.ts`):**
   - `createAuth()` configures Better Auth with Convex adapter
   - `authComponent` from `createClient<DataModel>(components.betterAuth)` provides auth utilities
   - Email/password auth enabled with `requireEmailVerification: false` for development

2. **Web App Integration:**
   - Client: `apps/web/lib/auth-client.ts` creates `authClient` with `convexClient()` plugin
   - Server: `apps/web/lib/auth-server.ts` exports `getToken()` for Next.js server components
   - Provider: Wrap app in `ConvexBetterAuthProvider` (see `apps/web/components/providers/convex-client-provider.tsx`)
   - API routes: `apps/web/app/api/auth/[...all]/route.ts` handles auth callbacks via `nextJsHandler()`

3. **Environment Variables:**
   - Web app needs `NEXT_PUBLIC_CONVEX_URL` (client-side)
   - Backend needs `CONVEX_SITE_URL` and `SITE_URL` (for auth redirects)

**Pattern:** Authentication state flows from Better Auth → Convex → React via `ConvexBetterAuthProvider`. Use `useQuery(api.auth.getCurrentUser)` to get authenticated user.

## Code Style & Formatting

Uses **Biome** (not ESLint/Prettier):

```bash
pnpm format  # Auto-format all files
pnpm check   # Lint + format with auto-fix
```

**Biome conventions from `biome.json`:**
- Double quotes, semicolons as needed, trailing commas ES5-style
- Import types: prefer `import type { Foo } from 'bar'`
- Node.js imports: use `node:` protocol (`import fs from 'node:fs'`)
- Tailwind class sorting: enabled with `cn()`, `clsx()`, `cva()` functions
- 100 character line width
- Excludes: `convex/_generated/**` from all checks

**Pre-commit hooks:** `lint-staged` runs Biome checks automatically via Husky.

## Convex-Specific Patterns

### Importing Generated API

```typescript
// In web app
import { api } from "@repo/backend/convex/_generated/api"
import { useQuery, useMutation } from "convex/react"

const data = useQuery(api.myModule.myQuery, { arg: "value" })
const doThing = useMutation(api.myModule.myMutation)
```

### Component-Based Architecture

Backend uses Convex components via `defineApp()` in `convex.config.ts`:
```typescript
import betterAuth from "@convex-dev/better-auth/convex.config"
import { defineApp } from "convex/server"

const app = defineApp()
app.use(betterAuth)  // Mounts Better Auth component
```

Components provide isolated functionality (like auth) that can be mounted into your app.

## Turborepo Task Dependencies

From `turbo.json`:
- `build` depends on `^build` (builds dependencies first)
- `dev` is persistent and not cached
- Build outputs: `.next/**`, `dist/**`
- Environment files (`.env*`) are included in cache keys

**Filter syntax:** `turbo -F web dev` runs dev only in web workspace. Turborepo will automatically run prerequisite tasks in dependency order.

## Package Manager

**pnpm** with workspace protocol:
- Dependencies use `workspace:*` to reference internal packages
- Lockfile is `pnpm-lock.yaml`
- Workspace packages defined in `pnpm-workspace.yaml`
- Node.js ≥20 required

## Common Gotchas

1. **Convex functions must be in `packages/backend/convex/`** - not subdirectories outside it
2. **React 19 is enforced** via resolutions - check component compatibility
3. **Next.js uses App Router only** - no pages directory
4. **Biome, not Prettier** - don't add Prettier configs
5. **Convex auth requires both client and server setup** - missing either breaks auth flow
6. **`expectAuth: true` in ConvexReactClient** - queries pause until authenticated

## File Naming Conventions

- Components: PascalCase with `.tsx` extension
- Utilities: kebab-case with `.ts` extension
- Convex functions: camelCase with `.ts` extension (e.g., `healthCheck.ts`)
- Route files: Next.js conventions (`page.tsx`, `layout.tsx`, `route.ts`)
