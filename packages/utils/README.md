# @repo/utils

**Shared utility functions for the monorepo**

This package contains pure JavaScript/TypeScript utility functions that are framework-agnostic and can be used across all apps (web, native, backend).

## Purpose

- **Minimal runtime dependencies** - Only essential utilities
- **Universal compatibility** - Works in browser, Node.js, and React Native
- **Zero framework assumptions** - Pure functions only
- **Battle-tested** - Utilities used across multiple apps

## What Goes Here

✅ **Include:**
- Error parsing and formatting
- ID generation utilities
- Date/time formatters
- String manipulation helpers
- Data transformation utilities
- Common validation logic

❌ **Do NOT Include:**
- Framework-specific utilities (Next.js, Expo, React)
- UI component helpers (use app-specific libs)
- DOM manipulation (web-only APIs)
- React Native APIs (native-only)
- React hooks (use app-specific hooks)

## Usage

### Error handling

\`\`\`typescript
import { parseAuthError, getAuthErrorMessage, isAuthError } from "@repo/utils/errors"

try {
  await authClient.signIn.email({ email, password })
} catch (error) {
  const authError = parseAuthError(error)
  console.error(authError.message)
  
  if (isAuthError(error, 'INVALID_CREDENTIALS')) {
    // Handle specific error
  }
}
\`\`\`

### ID generation

\`\`\`typescript
import { generateUniqueId } from "@repo/utils/id"

const taskId = generateUniqueId("task")
// => "task-lk3j2k1-9a8b7c"
\`\`\`

## Package Structure

\`\`\`
packages/utils/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts     # Barrel exports
    ├── errors.ts    # Error parsing utilities
    └── id.ts        # ID generation
\`\`\`

## Adding New Utilities

1. Create a new file in `src/` (e.g., `src/date.ts`)
2. Export pure functions with clear JSDoc comments
3. Export from `src/index.ts` for convenience
4. Test in both web and native environments

**Compatibility Check:**
- ✅ Uses only standard JavaScript APIs (, , , etc.)
- ✅ No , , or other browser-specific APIs
- ✅ No React Native APIs (, , etc.)
- ✅ No framework-specific imports

**Note:** If a utility is only useful in one platform, keep it app-specific instead of adding it here.
