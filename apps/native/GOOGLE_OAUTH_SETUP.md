# Google OAuth Setup for Expo Native App

This document explains how to set up and use Google OAuth authentication in your Expo native app with Better Auth and Convex.

## ✅ What's Already Implemented

The following components have been successfully configured:

### 1. Backend Configuration
- ✅ Google OAuth provider configured in `packages/backend/convex/auth.ts`
- ✅ Better Auth with Convex adapter set up
- ✅ HTTP routes registered for authentication
- ✅ Expo plugin enabled for mobile support

### 2. Frontend Implementation
- ✅ `useGoogleSignIn` hook created (`apps/native/lib/auth/hooks/use-google-sign-in.ts`)
- ✅ `GoogleSignInButton` component (`apps/native/components/auth/google-sign-in-button.tsx`)
- ✅ Sign-in screen updated with Google OAuth button
- ✅ Home screen displays user name and email
- ✅ Logout functionality redirects to sign-in screen

### 3. Project Structure
```
apps/native/
├── components/auth/
│   ├── google-sign-in-button.tsx  ← New Google button component
│   └── index.ts                    ← Updated exports
├── lib/auth/
│   ├── hooks/
│   │   ├── use-google-sign-in.ts  ← New Google OAuth hook
│   │   └── index.ts                ← Updated exports
│   └── client.ts                   ← Better Auth client config
└── app/
    ├── (auth)/
    │   └── sign-in.tsx             ← Updated with Google button
    └── (tabs)/
        └── index.tsx               ← Updated with user info display
```

## 🔧 Required Environment Variables

You need to configure the following environment variables:

### Backend (`packages/backend/.env.local`)
```bash
# Google OAuth credentials from Google Cloud Console
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Better Auth secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key

# Convex deployment URLs (auto-generated)
CONVEX_DEPLOYMENT=dev:your-deployment
CONVEX_SITE_URL=https://your-deployment.convex.site
```

### Native App (`apps/native/.env.local`)
```bash
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site
```

## 📱 Google Cloud Console Setup

Follow these steps to create and configure OAuth credentials:

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (if not already enabled)

### 2. Configure OAuth Consent Screen
1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required fields:
   - App name
   - User support email
   - Developer contact email
4. Add scopes (at minimum):
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Add test users if needed
6. Save and continue

### 3. Create OAuth Credentials

#### For Development (iOS Simulator/Android Emulator)
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Add authorized redirect URIs:
   ```
   https://your-deployment.convex.site/api/auth/callback/google
   ```
5. Save and copy the **Client ID** and **Client Secret**

#### For Production (iOS/Android Devices)

**iOS:**
1. Create an **iOS** OAuth client ID
2. Add your bundle identifier (from `app.json`)
3. Add authorized redirect URI:
   ```
   native://auth/callback
   ```

**Android:**
1. Create an **Android** OAuth client ID
2. Add your package name (from `app.json`)
3. Add your SHA-1 certificate fingerprint:
   ```bash
   # Debug keystore
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
4. Add authorized redirect URI:
   ```
   native://auth/callback
   ```

### 4. Update Environment Variables
Add the credentials to `packages/backend/.env.local`:
```bash
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## 🚀 How It Works

### Authentication Flow

1. **User clicks "Continue with Google"**
   - `GoogleSignInButton` triggers `useGoogleSignIn` hook
   - Hook calls `authClient.signIn.social({ provider: "google" })`

2. **Better Auth initiates OAuth flow**
   - Opens Google OAuth consent screen in browser
   - User grants permissions
   - Google redirects to `native://auth/callback`

3. **Expo handles the deep link**
   - Better Auth Expo plugin intercepts the callback
   - Exchanges authorization code for tokens
   - Creates user session in Convex database

4. **User is redirected**
   - Success toast notification appears
   - User lands on `/(tabs)` home screen
   - User info (name, email) is displayed

### User Info Display

The home screen now shows:
- Welcome message with user's name
- User account card with:
  - Name
  - Email address
- Logout button

### Logout Flow

1. User clicks "Logout" button
2. `useLogout` hook calls `authClient.signOut()`
3. Session is cleared from:
   - Expo SecureStore (local)
   - Convex database (server)
4. User is redirected to sign-in screen

## 🔑 Key Components

### `useGoogleSignIn` Hook
```typescript
import { useGoogleSignIn } from "@/lib/auth/hooks"

function MyComponent() {
  const { signInWithGoogle, isLoading, error } = useGoogleSignIn()
  
  return (
    <Button onPress={signInWithGoogle} disabled={isLoading}>
      Sign in with Google
    </Button>
  )
}
```

### `GoogleSignInButton` Component
```typescript
import { GoogleSignInButton } from "@/components/auth"

function SignInScreen() {
  return (
    <View>
      {/* Email/password form */}
      <GoogleSignInButton />
    </View>
  )
}
```

### User Info Access
```typescript
import { useAuthState } from "@/lib/auth/hooks"

function Profile() {
  const { user, isAuthenticated } = useAuthState()
  
  if (!isAuthenticated) return <Text>Not signed in</Text>
  
  return (
    <View>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
    </View>
  )
}
```

## 🧪 Testing

### 1. Start Development Servers
```bash
# Terminal 1: Start Convex backend
pnpm dev:server

# Terminal 2: Start Expo
pnpm dev:native
```

### 2. Test on Simulator/Emulator
```bash
# iOS Simulator
pnpm ios

# Android Emulator
pnpm android
```

### 3. Test Flow
1. Open the app
2. Navigate to sign-in screen
3. Click "Continue with Google"
4. Complete OAuth flow in browser
5. Verify redirect to home screen
6. Check that name and email are displayed
7. Test logout button

## 🐛 Troubleshooting

### "Redirect URI mismatch" error
**Cause:** The redirect URI in Google Cloud Console doesn't match your Convex site URL.

**Solution:**
1. Check your `CONVEX_SITE_URL` in `.env.local`
2. Add this exact URI to Google Console:
   ```
   https://your-deployment.convex.site/api/auth/callback/google
   ```

### Deep link not working
**Cause:** App scheme not properly configured.

**Solution:**
1. Verify `scheme: "native"` in `app.json`
2. Ensure `trustedOrigins: ["native://"]` in backend `auth.ts`
3. Rebuild the app: `expo prebuild && expo run:ios`

### User info not displaying
**Cause:** Google scopes not properly configured.

**Solution:**
1. Verify scopes in backend `auth.ts`:
   ```typescript
   google: {
     clientId: "...",
     clientSecret: "...",
     accessType: "offline",
     prompt: "select_account consent",
   }
   ```
2. Clear user consent in Google account settings and sign in again

### Session not persisting
**Cause:** SecureStore not properly configured.

**Solution:**
1. Verify `expo-secure-store` is installed
2. Check `expoClient` configuration in `client.ts`:
   ```typescript
   expoClient({
     scheme: "native",
     storagePrefix: "native",
     storage: SecureStore,
   })
   ```

## 📚 Additional Resources

- [Better Auth Documentation](https://better-auth.netlify.app/)
- [Better Auth Expo Guide](https://convex-better-auth.netlify.app/framework-guides/expo)
- [Convex Better Auth Component](https://convex-better-auth.netlify.app/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)

## 🎉 Summary

You now have a fully functional Google OAuth authentication system in your Expo app! Users can:

✅ Sign in with Google  
✅ See their profile information (name, email)  
✅ Sign out and return to the login screen  
✅ Have sessions persist across app restarts  

The implementation follows best practices and integrates seamlessly with your existing email/password authentication flow.
