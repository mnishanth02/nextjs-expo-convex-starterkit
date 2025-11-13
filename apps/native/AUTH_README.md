# Native App Authentication

This directory contains the authentication implementation for the Expo mobile app.

## Setup

### Environment Variables

Create a `.env.local` file in the `apps/native` directory:

```bash
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

You can find your Convex URL in `packages/backend/.env.local` or your Convex dashboard.

## Structure

```
apps/native/
├── app/
│   ├── _layout.tsx                 # Root layout with ConvexProvider and auth-based routing
│   └── (auth)/                     # Auth flow screens
│       ├── _layout.tsx             # Auth layout (no header)
│       ├── sign-in.tsx             # Sign-in screen
│       └── sign-up.tsx             # Sign-up screen
├── components/
│   ├── auth/                       # Reusable auth components
│   │   ├── auth-input.tsx          # Styled input with validation display
│   │   └── auth-button.tsx         # Button with loading state
│   └── providers/
│       └── convex-client-provider.tsx  # Convex + Better Auth provider
└── lib/
    ├── auth/
    │   ├── client.ts               # Expo auth client configuration
    │   ├── hooks.ts                # Auth state hooks
    │   └── hooks/                  # Auth action hooks
    │       ├── use-sign-in.ts      # Sign-in hook
    │       └── use-sign-up.ts      # Sign-up hook
    └── schemas/
        └── auth.ts                 # Zod validation schemas
```

## Features

### Authentication Screens

- **Sign In**: Email/password authentication with validation
- **Sign Up**: User registration with name, email, password, and password confirmation
- **Protected Routes**: Automatic redirect based on authentication state

### Form Validation

Uses Zod schemas with React Hook Form:

```typescript
// Password requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
```

### UI Components

#### AuthInput
- Label and error message display
- Focus and error state styling
- Full TextInput prop passthrough
- Touched state support

#### AuthButton
- Primary and secondary variants
- Loading state with ActivityIndicator
- Disabled state handling
- Press feedback

### Hooks

#### useSignIn()
```typescript
const { signIn, isLoading, error } = useSignIn()

await signIn({
  email: "user@example.com",
  password: "password123"
})
```

#### useSignUp()
```typescript
const { signUp, isLoading, error } = useSignUp()

await signUp({
  name: "John Doe",
  email: "user@example.com",
  password: "Password123",
  confirmPassword: "Password123"
})
```

#### useAuthState()
```typescript
const { isAuthenticated, isLoading, user, session } = useAuthState()
```

## User Flow

1. **Unauthenticated User**
   - App opens to `(auth)/sign-in` screen
   - User can navigate to `(auth)/sign-up` via link

2. **Sign Up**
   - User fills in name, email, password, confirm password
   - Form validates input
   - Success → Toast notification + redirect to `(tabs)` home
   - Error → Toast notification with error message

3. **Sign In**
   - User fills in email and password
   - Form validates input
   - Success → Toast notification + redirect to `(tabs)` home
   - Error → Toast notification with error message

4. **Authenticated User**
   - User can access `(tabs)` screens
   - Session persists via SecureStore (Better Auth integration)

## Error Handling

Errors are parsed using the shared `@repo/utils` package:

```typescript
import { parseAuthError } from "@repo/utils/errors"

const { error, code } = parseAuthError(response.error)
// error: User-friendly message
// code: Specific error code (invalid_email, user_not_found, etc.)
```

Common error messages are displayed via Toast notifications.

## Toast Notifications

The app uses `react-native-toast-message` for user feedback:

```typescript
import Toast from "react-native-toast-message"

Toast.show({
  type: "success", // or "error", "info"
  text1: "Title",
  text2: "Message"
})
```

Toast component is rendered in the root layout above all other UI.

## Session Management

- Sessions are stored securely using Expo SecureStore
- Better Auth handles session refresh automatically
- Auth state is checked in root layout to control navigation

## Next Steps

To test the authentication:

1. Start the Convex backend:
   ```bash
   pnpm dev:server
   ```

2. Start the Expo dev server:
   ```bash
   pnpm dev:native
   ```

3. Open the app on your device/simulator

4. Try creating an account and signing in

## Customization

### Styling

All styles use React Native's StyleSheet. Colors and spacing follow a consistent design system:

- Primary: `#3B82F6` (blue)
- Error: `#EF4444` (red)
- Text: `#111827` (dark gray)
- Border: `#D1D5DB` (light gray)

### Validation Rules

Modify schemas in `lib/schemas/auth.ts` to change validation requirements.

### Error Messages

Update error message mapping in `packages/utils/src/errors.ts` to customize user-facing error text.
