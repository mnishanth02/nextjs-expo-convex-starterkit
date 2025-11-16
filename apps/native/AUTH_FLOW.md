# Authentication Flow & Protected Routes

## Overview

This app implements a robust authentication system using **Better Auth** with **Expo Router's Stack.Protected** feature (2025 pattern). The authentication guards prevent unauthorized access to protected screens and automatically handle navigation based on auth state.

## Architecture

### Key Components

1. **Root Layout** (`app/_layout.tsx`)
   - Wraps app in `ConvexClientProvider` for auth context
   - Contains `RootNavigator` component that implements route protection
   - Shows loading screen while checking auth state
   - Uses `Stack.Protected` to guard routes based on authentication

2. **Protected Routes** (`Stack.Protected`)
   - **(tabs)** - Main app interface (authenticated users only)
   - **modal** - Modal screens (authenticated users only)

3. **Public Routes** (`Stack.Protected with !guard`)
   - **(auth)** - Sign in/sign up screens (unauthenticated users only)

4. **Index Route** (`app/index.tsx`)
   - Handles initial navigation
   - Redirects to `/(tabs)` if authenticated
   - Redirects to `/(auth)/sign-in` if not authenticated

## Authentication Flow

### First Launch (Not Authenticated)
```
App Start
  ↓
Root Layout renders
  ↓
useAuthState() checks session (isLoading: true)
  ↓
<AuthLoading /> displayed
  ↓
Session check complete (isLoading: false, isAuthenticated: false)
  ↓
Stack.Protected allows (auth) routes only
  ↓
index.tsx redirects to /(auth)/sign-in
  ↓
User sees sign-in screen
```

### Sign-In Success
```
User submits credentials
  ↓
authClient.signIn.email() or authClient.signIn.social()
  ↓
Better Auth creates session
  ↓
useAuthState() detects session change (isAuthenticated: true)
  ↓
Stack.Protected blocks (auth) routes, allows (tabs) routes
  ↓
index.tsx redirects to /(tabs)
  ↓
User sees main app interface
```

### Sign-Out
```
User clicks logout
  ↓
authClient.signOut()
  ↓
Better Auth clears session
  ↓
useAuthState() detects change (isAuthenticated: false)
  ↓
Stack.Protected blocks (tabs) routes, allows (auth) routes
  ↓
Auto-redirects to /(auth)/sign-in
  ↓
User sees sign-in screen
```

### Already Authenticated (App Restart)
```
App Start
  ↓
Root Layout renders
  ↓
useAuthState() checks session (isLoading: true)
  ↓
<AuthLoading /> displayed
  ↓
Session found in SecureStore (isLoading: false, isAuthenticated: true)
  ↓
Stack.Protected allows (tabs) routes only
  ↓
index.tsx redirects to /(tabs)
  ↓
User sees main app interface (NO sign-in screen flash!)
```

## How Stack.Protected Works

### Protected Routes Pattern (Expo Router SDK 53+)

```tsx
<Stack.Protected guard={isAuthenticated}>
  {/* These screens only render when isAuthenticated is true */}
  <Stack.Screen name="(tabs)" />
  <Stack.Screen name="modal" />
</Stack.Protected>

<Stack.Protected guard={!isAuthenticated}>
  {/* These screens only render when isAuthenticated is false */}
  <Stack.Screen name="(auth)" />
</Stack.Protected>
```

### Benefits:
- ✅ **Declarative** - Route protection logic in one place
- ✅ **Automatic redirects** - No manual navigation needed
- ✅ **No screen flashing** - Protected routes don't render at all
- ✅ **Deep link protection** - Deep links to protected routes are blocked
- ✅ **History cleanup** - Navigation history is cleared when guard changes

## Authentication State Management

### useAuthState Hook

Located in `lib/auth/hooks.ts`:

```typescript
export function useAuthState(): AuthState<User, Session> {
  const { data: session, isPending, error } = authClient.useSession()

  return {
    isAuthenticated: Boolean(session && !isPending),
    isLoading: isPending,
    user: session?.user ?? null,
    session: session?.session ?? null,
    error: error as Error | null | undefined,
  }
}
```

**Key States:**
- `isLoading: true` - Checking authentication (show loading screen)
- `isAuthenticated: true` - User is signed in (allow protected routes)
- `isAuthenticated: false` - User not signed in (allow public routes only)

### Session Persistence

- **Storage**: Expo SecureStore (encrypted)
- **Prefix**: `"native"` (matches app scheme)
- **Auto-restore**: Session restored on app restart
- **Auto-refresh**: Better Auth handles token refresh

## Sign-In Methods

### 1. Email/Password Sign-In

**Hook**: `useSignIn()`
**Location**: `lib/auth/hooks/use-sign-in.ts`

```typescript
const { signIn, isLoading } = useSignIn()

await signIn({ email, password })
// Auth state changes automatically
// Stack.Protected redirects to (tabs)
```

### 2. Email/Password Sign-Up

**Hook**: `useSignUp()`
**Location**: `lib/auth/hooks/use-sign-up.ts`

```typescript
const { signUp, isLoading } = useSignUp()

await signUp({ name, email, password })
// Auth state changes automatically
// Stack.Protected redirects to (tabs)
```

### 3. Google OAuth

**Hook**: `useGoogleSignIn()`
**Location**: `lib/auth/hooks/use-google-sign-in.ts`

```typescript
const { signInWithGoogle, isLoading } = useGoogleSignIn()

await signInWithGoogle()
// Opens browser for Google OAuth
// Redirects back to app with deep link
// Auth state changes automatically
// Stack.Protected redirects to (tabs)
```

**Callback URL**: `native://(tabs)`
- Browser closes after OAuth
- App opens via deep link
- User lands on tabs screen

## Sign-Out

**Hook**: `useLogout()`
**Location**: `lib/auth/hooks/use-logout.ts`

```typescript
const { logout, isLoading } = useLogout()

await logout()
// Clears session from SecureStore
// Auth state changes (isAuthenticated: false)
// Stack.Protected redirects to /(auth)/sign-in
```

## Important Implementation Notes

### ✅ DO:
- Let `Stack.Protected` handle navigation automatically
- Show loading state while `isLoading` is true
- Use `useAuthState()` for auth status checks
- Keep auth logic in hooks, not components

### ❌ DON'T:
- Manually call `router.push()` or `router.replace()` after sign-in
- Show protected screens before auth state is confirmed
- Navigate inside sign-in hooks (Stack.Protected handles it)
- Render protected content during `isLoading` state

## File Structure

```
apps/native/
├── app/
│   ├── _layout.tsx              # Root layout with Stack.Protected
│   ├── index.tsx                # Initial redirect handler
│   ├── (auth)/                  # Public routes (sign-in, sign-up)
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   └── (tabs)/                  # Protected routes (main app)
│       ├── _layout.tsx
│       ├── index.tsx
│       └── explore.tsx
├── components/
│   └── auth/
│       ├── auth-loading.tsx     # Loading screen component
│       ├── auth-button.tsx
│       ├── auth-input.tsx
│       └── google-sign-in-button.tsx
└── lib/
    └── auth/
        ├── client.ts            # Better Auth client config
        ├── hooks.ts             # useAuthState hook
        └── hooks/               # Auth action hooks
            ├── use-sign-in.ts
            ├── use-sign-up.ts
            ├── use-google-sign-in.ts
            └── use-logout.ts
```

## Troubleshooting

### Issue: Screen flashes briefly during redirect
**Solution**: Already fixed! Loading state prevents rendering until auth is confirmed.

### Issue: Can access protected routes when not authenticated
**Check**:
1. `Stack.Protected guard={isAuthenticated}` wraps protected screens
2. `useAuthState()` is returning correct `isAuthenticated` value
3. Better Auth session is properly configured

### Issue: Stuck on loading screen
**Check**:
1. Convex backend is running
2. `EXPO_PUBLIC_CONVEX_SITE_URL` is set correctly in `.env.local`
3. Better Auth is properly configured in backend

### Issue: Deep links to protected routes don't work
**Expected**: This is correct behavior! Deep links to protected routes are automatically blocked by `Stack.Protected` and redirect to the appropriate screen based on auth state.

## Testing the Flow

### Test Case 1: Fresh Install (Not Authenticated)
1. Install app on device/emulator
2. Launch app
3. **Expected**: See loading → sign-in screen (no flashing)
4. Sign in with email or Google
5. **Expected**: Success toast → immediate navigation to tabs
6. **Verify**: No sign-in screen visible after success

### Test Case 2: App Restart (Already Authenticated)
1. Sign in successfully
2. Close app completely (kill process)
3. Reopen app
4. **Expected**: Loading → tabs screen (no sign-in screen)
5. **Verify**: User stays logged in

### Test Case 3: Sign Out
1. While signed in, go to profile
2. Click logout
3. **Expected**: Auto-redirect to sign-in screen
4. **Verify**: Cannot navigate back to tabs

### Test Case 4: Deep Link Protection
1. While signed out, try deep link to protected route
2. **Expected**: Redirects to sign-in screen
3. After sign-in, **Expected**: Redirects to intended deep link destination

## References

- [Expo Router Protected Routes](https://docs.expo.dev/router/advanced/protected)
- [Better Auth Expo Guide](https://better-auth.com/docs/integrations/expo)
- [Expo Router Authentication](https://docs.expo.dev/router/reference/authentication/)
