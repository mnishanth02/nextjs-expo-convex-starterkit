# @repo/auth

Shared authentication utilities for Better Auth + Convex integration across web and mobile platforms.

## Overview

This package provides reusable authentication utilities built on [Better Auth](https://www.better-auth.com) with [Convex](https://convex.dev) backend. It exports hooks, error handling, and TypeScript types that work seamlessly in both Next.js (web) and Expo (React Native) applications.

**What's included:**
- ✅ Auth client configured for Convex
- ✅ React hooks for auth state and authenticated queries
- ✅ Error parsing with user-friendly messages
- ✅ TypeScript types for User, Session, and more
- ✅ Works in both web and React Native

**What's NOT included:**
- ❌ Form validation - Use [Zod](https://zod.dev) + [React Hook Form](https://react-hook-form.com) in your app code
- ❌ UI components - Implement forms in your app with your chosen UI library

**Note:** Server-side auth configuration lives in `@repo/backend/convex/auth.config.ts` to avoid circular dependencies and keep the architecture simple.

## Architecture

```
packages/
  auth/
    src/
      client.ts      # React auth client
      hooks.ts       # Auth hooks (useAuthState, etc.)
      errors.ts      # Error parsing utilities
      validation.ts  # Form validators
      types.ts       # TypeScript type definitions
      index.ts       # Barrel exports
  backend/
    convex/
      auth.config.ts  # Server-side auth configuration
      http.ts         # HTTP routes registration
```

## Quick Start

### 1. Basic Authentication

```tsx
import { authClient, useAuthState } from "@repo/auth"

function Profile() {
  const { isAuthenticated, isLoading, user } = useAuthState()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return <div>Hello {user?.name}</div>
}
```

### 2. Form Validation with Zod

Install dependencies in your app:

```bash
pnpm add zod react-hook-form @hookform/resolvers
```

Create Zod schemas for validation:

```tsx
// app/lib/auth-schemas.ts
import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type SignInForm = z.infer<typeof signInSchema>
export type SignUpForm = z.infer<typeof signUpSchema>
```

### 3. Sign In with Error Handling

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient, parseAuthError } from "@repo/auth"
import { signInSchema, type SignInForm } from "@/lib/auth-schemas"

function SignInForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  const [apiError, setApiError] = useState("")

  const onSubmit = async (data: SignInForm) => {
    try {
      await authClient.signIn.email(data)
      // Redirect on success
    } catch (error) {
      const authError = parseAuthError(error)
      setApiError(authError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      {apiError && <span>{apiError}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
```

## API Reference

### Hooks

#### `useAuthState()`

Get current authentication state.

```tsx
const { isAuthenticated, isLoading, user, session, error } = useAuthState()
```

**Returns:**
- `isAuthenticated: boolean` - Whether user is signed in
- `isLoading: boolean` - Whether auth state is loading
- `user: User | null` - Current user object
- `session: Session | null` - Current session object
- `error: Error | null` - Any auth error

#### `useAuthenticatedQuery(query, args)`

Automatically skip Convex queries when user is not authenticated.

```tsx
import { api } from "@repo/backend/convex/_generated/api"

const userData = useAuthenticatedQuery(api.users.getCurrentUserData, {})
```

**Parameters:**
- `query` - Convex query function reference
- `args` - Query arguments (optional)

**Returns:** Query result or undefined if loading/unauthenticated

#### `useUserId()`

Get current user ID synchronously.

```tsx
const userId = useUserId() // string | null
```

#### `useIsAuthenticated()`

Boolean check if user is authenticated.

```tsx
const isAuthenticated = useIsAuthenticated() // boolean
```

### Auth Client

Pre-configured Better Auth client with Convex plugin.

```tsx
import { authClient } from "@repo/auth/client"

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123"
})

// Sign up
await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "John Doe"
})

// Sign out
await authClient.signOut()

// Get session (React hook)
const { data: session } = authClient.useSession()
```

### Form Validation (Zod + React Hook Form)

**Recommended approach:** Create Zod schemas in your app code, not in this package.

```tsx
// Your app code
import { z } from "zod"

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Required"),
})

const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[a-z]/, "One lowercase letter")
    .regex(/[0-9]/, "One number"),
  confirmPassword: z.string(),
  name: z.string().min(2, "At least 2 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
})
```

**Why not included in this package?**
- Different apps have different validation requirements
- Zod schemas should be colocated with your forms
- Backend can reuse the same schemas (type-safe validation)
- Supports both Next.js and React Native identically

### Error Handling

#### `parseAuthError(error)`

Parse Better Auth errors into user-friendly messages.

```tsx
import { parseAuthError } from "@repo/auth/errors"

try {
  await authClient.signIn.email({ email, password })
} catch (error) {
  const authError = parseAuthError(error)
  console.log(authError.code) // "INVALID_CREDENTIALS"
  console.log(authError.message) // "Invalid email or password"
}
```

**Error codes:**
- `INVALID_CREDENTIALS` - Wrong email/password
- `USER_NOT_FOUND` - User doesn't exist
- `EMAIL_ALREADY_EXISTS` - Email taken
- `EMAIL_NOT_VERIFIED` - Email needs verification
- `WEAK_PASSWORD` - Password too weak
- `NETWORK_ERROR` - Connection problem
- `SESSION_EXPIRED` - Session timed out
- `UNAUTHORIZED` - No permission
- `UNKNOWN_ERROR` - Unexpected error

#### `getAuthErrorMessage(error)`

Get just the user-friendly message.

```tsx
const message = getAuthErrorMessage(error)
// Returns: "Invalid email or password"
```

#### `isAuthError(error, code)`

Check if error matches a specific code.

```tsx
if (isAuthError(error, "INVALID_CREDENTIALS")) {
  // Handle invalid credentials specifically
}
```

### TypeScript Types

All types are exported from the package:

```tsx
import type { 
  User,
  Session,
  AuthState,
  SignInCredentials,
  SignUpData,
  OAuthProvider,
  // ... and more
} from "@repo/auth/types"
```

## Installation

This package is already included in the monorepo. For apps:

```json
{
  "dependencies": {
    "@repo/auth": "workspace:*",
    "@repo/backend": "workspace:*"
  }
}
```

## Usage Examples

### Complete Sign-In Form (Next.js)

```tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient, parseAuthError } from "@repo/auth"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type SignInForm = z.infer<typeof signInSchema>

export function SignInForm() {
  const [apiError, setApiError] = useState("")
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInForm) => {
    setApiError("")
    try {
      await authClient.signIn.email(data)
      // Redirect on success
    } catch (error) {
      const authError = parseAuthError(error)
      setApiError(authError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email")}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      {apiError && <span>{apiError}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
```

### Protected Component

```tsx
import { useAuthState, useAuthenticatedQuery } from "@repo/auth"
import { api } from "@repo/backend/convex/_generated/api"

export function UserDashboard() {
  const { isLoading, isAuthenticated } = useAuthState()
  const dashboardData = useAuthenticatedQuery(api.dashboard.getData, {})

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return (
    <div>
      <h1>Dashboard</h1>
      {dashboardData && <pre>{JSON.stringify(dashboardData, null, 2)}</pre>}
    </div>
  )
}
```

### React Native Example (Expo)

```tsx
import { useState } from "react"
import { View, Text, TextInput, Button } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient, useAuthState, parseAuthError } from "@repo/auth"

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Required"),
})

type SignInForm = z.infer<typeof signInSchema>

export function NativeSignIn() {
  const { isAuthenticated, user } = useAuthState()
  const [apiError, setApiError] = useState("")

  const { control, handleSubmit, formState: { errors } } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInForm) => {
    setApiError("")
    try {
      await authClient.signIn.email(data)
    } catch (error) {
      const authError = parseAuthError(error)
      setApiError(authError.message)
    }
  }

  if (isAuthenticated) {
    return <Text>Welcome {user?.name}</Text>
  }

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Password"
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}

      {apiError && <Text>{apiError}</Text>}

      <Button title="Sign In" onPress={handleSubmit(onSubmit)} />
    </View>
  )
}
```

### Server-Side Setup (Next.js)

For Next.js apps, you also need server-side configuration:

#### 1. Set up the provider

```tsx
// apps/web/components/providers/convex-client-provider.tsx
"use client"

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { ConvexReactClient } from "convex/react"
import { authClient } from "@/lib/auth-client"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  expectAuth: false, // Set to true to pause queries until authenticated
})

export function ConvexClientProvider({ children }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  )
}
```

#### 2. Set up server auth

```typescript
// apps/web/lib/auth-server.ts
import { getToken } from "@repo/backend/convex/auth.config"

export { getToken }
```

#### 3. API route handler

```typescript
// apps/web/app/api/auth/[...all]/route.ts
import { nextJsHandler } from "@convex-dev/better-auth/nextjs"

export const { GET, POST } = nextJsHandler()
```

#### 4. Use in Server Actions

```typescript
"use server"

import { fetchMutation } from "convex/nextjs"
import { api } from "@repo/backend/convex/_generated/api"
import { getToken } from "@/lib/auth-server"

export async function updateProfile(data: FormData) {
  const token = await getToken()
  await fetchMutation(
    api.users.update,
    { name: data.get("name") as string },
    { token }
  )
}
```

## Package Exports

The package provides multiple entry points for tree-shaking:

```tsx
// Import everything
import { authClient, useAuthState, parseAuthError } from "@repo/auth"

// Or import specific modules
import { authClient } from "@repo/auth/client"
import { useAuthState } from "@repo/auth/hooks"
import { parseAuthError } from "@repo/auth/errors"
import type { User, Session } from "@repo/auth/types"
```

## Platform Support

| Feature | Next.js | React Native (Expo) |
|---------|---------|---------------------|
| Auth Client | ✅ | ✅ |
| Auth Hooks | ✅ | ✅ |
| Error Handling | ✅ | ✅ |
| TypeScript Types | ✅ | ✅ |
| Zod + RHF | ✅ | ✅ |

## Backend Integration

Server-side configuration is in `@repo/backend/convex/auth.config.ts`. Use in Convex functions:

```typescript
// packages/backend/convex/myFunction.ts
import { query } from "./_generated/server"
import { authComponent } from "./auth.config"

export const myQuery = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx)
    if (!user) throw new Error("Unauthorized")
    
    // Use authenticated user
    return { userId: user.id, name: user.name }
  },
})
```

## Environment Variables

### Backend (`npx convex env set`)

```bash
BETTER_AUTH_SECRET=<random-32-byte-string>
SITE_URL=http://localhost:3000
CONVEX_SITE_URL=https://your-deployment.convex.site
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
APPLE_CLIENT_ID=<optional>
APPLE_CLIENT_SECRET=<optional>
```

### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Authentication Flow

1. User calls `authClient.signIn.email()` in React
2. Request → Next.js API route `/api/auth/[...all]`
3. `nextJsHandler()` → Convex HTTP endpoint
4. Better Auth handles authentication in Convex
5. Token returned & stored in client
6. Convex queries auto-include auth token

## Development

Build the package:

```bash
pnpm -F @repo/auth build
```

Watch mode:

```bash
pnpm -F @repo/auth dev
```

## Why This Architecture?

### ✅ Benefits

- **Lean & Focused**: Only auth-specific utilities, no form validation duplication
- **Standard Practice**: Uses industry-standard Zod + React Hook Form
- **Multi-Platform**: Works identically in Next.js and React Native
- **No Circular Dependencies**: Clean separation between auth client and backend
- **Type Safe**: Comprehensive TypeScript types for all auth operations
- **Reusable**: Error handling and hooks shared across all apps
- **Flexible**: Apps define their own validation rules via Zod schemas

### What This Package Provides

**~360 lines of focused utilities:**
- **4 React Hooks** for auth state management
- **Error Parser** with 9+ error codes and user-friendly messages
- **TypeScript Types** for User, Session, AuthState, etc.
- **Auth Client** pre-configured for Convex

### What You Provide in Your App

- **Zod Schemas** for form validation (email, password, custom rules)
- **React Hook Form** setup with zodResolver
- **UI Components** (forms, buttons, inputs)
- **Business Logic** specific to your app

This separation ensures:
- No redundant validation code
- Maximum flexibility for different apps
- Standard modern development practices
- Backend can reuse frontend Zod schemas

## Related Packages

- `@repo/backend` - Convex backend with auth configuration
- Server-side auth config is in `@repo/backend/convex/auth.config.ts`

## Resources

- [Better Auth Documentation](https://www.better-auth.com)
- [Better Auth + Convex Integration](https://www.better-auth.com/docs/integrations/convex)
- [Convex Documentation](https://docs.convex.dev)
- [Zod Documentation](https://zod.dev)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Complete Setup Guide](../../CONVEX_AUTH_SETUP.md)

