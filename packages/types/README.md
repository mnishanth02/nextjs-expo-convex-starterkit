# @repo/types

**Shared TypeScript types for the monorepo**

This package contains pure TypeScript type definitions that are framework-agnostic and can be used across all apps (web, native, backend).

## Purpose

- **Zero runtime dependencies** - Types are compile-time only
- **No build step required** - TypeScript files imported directly
- **Universal compatibility** - Works in Next.js, Expo, Node.js, and any TypeScript environment
- **Single source of truth** - Prevents type drift between apps

## What Goes Here

✅ **Include:**
- Auth-related data structures (`SignInCredentials`, `SignUpData`, etc.)
- Error type definitions (`AuthErrorCode`, `AuthError`)
- API contract types
- Shared domain models
- Common interfaces used across multiple apps

❌ **Do NOT Include:**
- Framework-specific types (Next.js, Expo, React Native)
- Types that depend on specific libraries
- Runtime code or utilities (use `@repo/utils` instead)
- Client-inferred types (e.g., `User` from auth client)

## Usage

### Import auth types

\`\`\`typescript
import type { SignInCredentials, SignUpData, AuthState } from "@repo/types/auth"
\`\`\`

### Import error types

\`\`\`typescript
import type { AuthError, AuthErrorCode } from "@repo/types/errors"
\`\`\`

### Import all types

\`\`\`typescript
import type { SignInCredentials, AuthError } from "@repo/types"
\`\`\`

## Package Structure

\`\`\`
packages/types/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts      # Barrel exports
    ├── auth.ts       # Auth-related types
    └── errors.ts     # Error type definitions
\`\`\`

## Adding New Types

1. Create or update a file in `src/` (e.g., `src/api.ts`)
2. Export the type from that file
3. Re-export from `src/index.ts` if needed for convenience
4. Document the types with JSDoc comments

**Note:** Keep this package lean. Only add types that are truly shared across multiple apps. App-specific types should stay in the app's `types/` directory.
