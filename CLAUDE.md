# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Turborepo monorepo featuring Next.js 16 (web) and Expo 54 (native) apps sharing a unified Convex serverless backend with Better Auth authentication.

**Key Stack:**
- Next.js 16 App Router + React 19 + Tailwind CSS 4
- Expo 54 (React Native 0.81) with New Architecture, typed routes, and NativeWind v4
- Convex backend (real-time database + serverless functions)
- Better Auth with Convex adapter for cross-platform authentication
- Biome for linting/formatting (not ESLint/Prettier)
- pnpm with workspace protocol

## Development Commands

### Start Development Servers

```bash
# Full stack (all apps + backend)
pnpm dev

# Individual apps (recommended for focused work)
pnpm dev:web       # Next.js on http://localhost:3000
pnpm dev:server    # Convex backend only

# First-time setup - creates packages/backend/.env.local with deployment credentials
pnpm dev:setup
```

### Native App Development

```bash
cd apps/native

# Start Expo development server
pnpm start

# Run on Android emulator/device
pnpm android

# Run on iOS simulator/device
pnpm ios

# Prebuild native projects (clean rebuild)
pnpm prebuild
```

### Build and Format

```bash
pnpm build           # Build all workspaces
pnpm format          # Auto-format with Biome
pnpm check           # Lint + format with auto-fix
pnpm upgrade:all     # Update all dependencies to latest
```

### Turborepo Filters

```bash
turbo -F web dev                    # Run dev only in web workspace
turbo -F @repo/backend dev          # Run dev only in backend
turbo build --filter=native         # Build native app and dependencies
```

### Convex Backend Commands

```bash
cd packages/backend
npx convex logs --tail              # Tail backend logs
npx convex dev --configure          # Reconfigure deployment
```

## Architecture

### Workspace Structure

```
apps/
  web/          - Next.js 16 App Router (port 3000)
  native/       - Expo 54 mobile app with NativeWind
packages/
  backend/      - Convex serverless backend
  web-ui/       - Radix UI component library (53 components)
  native-ui/    - NativeWind v4 component library for React Native
  types/        - Shared TypeScript types (zero runtime deps)
  utils/        - Shared utilities (error parsing, ID generation)
  config/       - Shared TSConfig presets
```

**Dependency flow:** Both apps import from `@repo/backend` via `workspace:*` protocol. Authentication flows through Better Auth → Convex → React providers.

### Convex Backend (`packages/backend/convex/`)

**Critical files:**
- `auth.ts` - Better Auth configuration with `createAuth()` and `authComponent`
- `auth.config.ts` - Better Auth provider config (configures Convex domain for auth)
- `convex.config.ts` - Mounts Better Auth component via `defineApp()`
- `http.ts` - HTTP router with `authComponent.registerRoutes()`
- `_generated/` - Auto-generated, never edit manually

**Function rules:**
- Must be **pure** - no Node.js APIs, no file system access
- Use `query()` for reads, `mutation()` for writes
- Schema is inferred from mutations - no migrations required
- Access DB via `ctx.db.query()`, `ctx.db.insert()`, `ctx.db.patch()`, `ctx.db.delete()`

**Getting authenticated user in Convex functions:**
```typescript
import { authComponent } from "./auth"

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx) // Returns user or null
  },
})
```

### Authentication Architecture

**Flow:**
1. Backend (`packages/backend/convex/auth.ts`) configures Better Auth with Convex adapter
2. HTTP routes (`packages/backend/convex/http.ts`) expose auth endpoints at `.convex.site` URL
3. Web client (`apps/web/lib/auth/client.ts`) uses `convexClient()` plugin, proxies through Next.js API routes
4. Native client (`apps/native/lib/auth/client.ts`) uses `expoClient()` plugin with SecureStore
5. Both wrap apps with `ConvexBetterAuthProvider` from `@convex-dev/better-auth/react`

**Important:** Use `expectAuth: false` in `ConvexReactClient` - Better Auth manages auth state, not Convex client.

**Trusted origins include:**
- Production: `SITE_URL`, `CONVEX_SITE_URL`, `native://` (Expo scheme)
- Development: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002`, `native://`

### Shared Packages

**`@repo/types`** - Framework-agnostic TypeScript types (zero runtime deps)
```typescript
import type { SignInCredentials, AuthState, AuthErrorCode } from "@repo/types"
```

**`@repo/utils`** - Framework-agnostic utilities
```typescript
import { parseAuthError, getAuthErrorMessage } from "@repo/utils/errors"
import { generateUniqueId } from "@repo/utils/id"
```

**`@repo/webui`** - Radix UI components with Tailwind CSS 4 (for web app)
```typescript
import { Button } from "@repo/webui/components/button"
import { Input } from "@repo/webui/components/input"
```

Built with: Radix UI primitives, `class-variance-authority`, `tailwind-merge`, React Hook Form integration.

**`@repo/native-ui`** - NativeWind v4 components (for native app)
```typescript
import { Button, Card, Input, Layout } from "@repo/native-ui"
```

Built with: NativeWind v4, gluestack-ui utilities, Tailwind CSS-compatible styling for React Native.

## Code Style (Biome)

**DO NOT use Prettier or ESLint** - this project uses Biome exclusively.

**Enforced conventions:**
- Double quotes, semicolons as needed, trailing commas ES5-style
- `import type { Foo }` for type imports (error level)
- `import { readFile } from "node:fs"` - enforce `node:` protocol (error level)
- Tailwind class sorting with `cn()`, `clsx()`, `cva()` functions
- 100 character line width
- Pre-commit hooks run Biome via Husky + lint-staged

**Excludes:** `convex/_generated/**` from all checks.

## Environment Variables

Apps require separate `.env.local` files copied from `.env.example`:

**Web** (`apps/web/.env.local`):
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site
```

**Native** (`apps/native/.env.local`):
```bash
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site
```

**Backend** (`packages/backend/.env.local` - auto-generated by `pnpm dev:setup`):
```bash
CONVEX_DEPLOYMENT=dev:your-deployment
BETTER_AUTH_SECRET=<generate-with-openssl-rand>
```

**Backend Environment Variables (set via Convex dashboard or CLI):**
```bash
# Set these in Convex deployment, not .env.local
npx convex env set SITE_URL https://your-deployment.convex.site
npx convex env set CONVEX_SITE_URL https://your-deployment.convex.site
npx convex env set NATIVE_GOOGLE_CLIENT_ID <your-google-client-id>
npx convex env set NATIVE_GOOGLE_CLIENT_SECRET <your-google-client-secret>
```

Get deployment URLs from Convex dashboard or `packages/backend/.env.local` after running setup.

## Native App (Expo) Specifics

**Configuration:**
- Scheme: `native://` for deep linking (defined in `app.json`)
- New Architecture: Enabled (`newArchEnabled: true`)
- Typed Routes: Enabled (`experiments.typedRoutes: true`)
- React Compiler: Enabled (`experiments.reactCompiler: true`)
- NativeWind v4: Enabled via `metro.config.js` with global CSS support

**Styling:**
- Uses NativeWind v4 for Tailwind CSS-compatible styling
- Global CSS entry: `apps/native/global.css`
- Metro config includes NativeWind transformer (`metro.config.js:17-20`)
- Components from `@repo/native-ui` use `className` prop (same as web)

**Authentication flow:**
1. Root layout checks auth via `useAuthState()` hook
2. Unauthenticated → redirect to `(auth)/sign-in`
3. Forms use React Hook Form + Zod validation (`apps/native/lib/schemas/auth.ts`)
4. Success → Toast notification + navigate to `(tabs)`
5. Sessions persist via Expo SecureStore (Better Auth integration)

**Password requirements** (from `apps/native/lib/schemas/auth.ts`):
- Min 8 characters, 1 uppercase, 1 lowercase, 1 number

## Critical Gotchas

1. **Convex functions must be in `packages/backend/convex/`** - nested folders OK, but outside this directory won't work
2. **React 19 is enforced** via `resolutions` and `pnpm.overrides` - check component compatibility before adding dependencies
3. **Next.js uses App Router only** - no pages directory support
4. **Use Biome, not Prettier/ESLint** - don't add Prettier configs
5. **Convex auth requires both client and server setup** - missing either breaks auth flow
6. **Environment variables differ between apps** - `NEXT_PUBLIC_*` vs `EXPO_PUBLIC_*`
7. **`expectAuth: false` required** - Better Auth manages authentication state, not ConvexReactClient
8. **Native app scheme must match** `app.json` scheme (`native://`) for deep linking
9. **Better Auth endpoint uses `.convex.site` URL** (not `.convex.cloud`) for auth requests
10. **Node.js ≥20 required** - enforced in root `package.json`
11. **NativeWind v4 requires global CSS** - must import `global.css` in native app entry point
12. **Metro config must enable package exports** - `unstable_enablePackageExports: true` required for workspace packages

## File Naming Conventions

- Components: PascalCase with `.tsx` (`AuthButton.tsx`)
- Utilities: kebab-case with `.ts` (`parse-auth-error.ts`)
- Convex functions: camelCase with `.ts` (`healthCheck.ts`)
- Next.js routes: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`
- Expo routes: File-based routing (`apps/native/app/`) with `_layout.tsx` for layouts

## Debugging

**Check auth state in browser console:**
```javascript
authClient.getSession() // Returns { user, session } or null
```

**Common issues:**
- Missing env vars: Verify `.env.local` files exist and match `.env.example`
- Auth not working: Verify `CONVEX_SITE_URL` matches between backend and apps
- Convex function errors: Check browser Network tab for function responses
- Expo auth issues: Clear app data/reinstall if SecureStore gets corrupted

## Package Management

**pnpm** with workspace protocol:
```bash
pnpm add <pkg> -w              # Add to root
pnpm add <pkg> -F web          # Add to web workspace
pnpm add <pkg> -F @repo/types  # Add to types package
```

- Lockfile: `pnpm-lock.yaml`
- Workspaces: `apps/*`, `packages/*`
- Dependencies use `workspace:*` to reference internal packages

## Code References

When referencing code, use the pattern `file_path:line_number` for easy navigation (e.g., `packages/backend/convex/auth.ts:72`).
