# Google OAuth Fix - Android Emulator Issue

## ✅ Your Google Console Configuration is CORRECT

**Good news!** Your Google Cloud Console setup is already correct. You should **NOT** add `native://` to the redirect URIs.

**Why:** Google OAuth only redirects to web URLs (your backend). Better Auth then handles redirecting to your app's custom scheme internally.

**Your current setup (KEEP AS IS):**
```
✅ http://localhost:3000/api/auth/callback/google
✅ https://wooden-porcupine-536.convex.site/api/auth/callback/google
```

---

## 🔧 The Real Fix: Rebuild Your Native App

### The Problem
After selecting a Google account, you're seeing the Google account settings page instead of being redirected back to your app. This happens because the Android intent filter for `native://` isn't registered in your app's manifest.

### The Solution (ONE STEP)

**Rebuild your native Android app** to register the intent filters:

```bash
# Stop all running dev servers
# Then run:

npx expo prebuild --clean && npx expo run:android
```

**Why this is needed:**
- Intent filters are baked into Android's `AndroidManifest.xml` at build time
- Just running `npx expo start` or reloading with `r` won't register them
- Your `app.json` already has the correct configuration
- You just need to rebuild the native project once

---

## 🧪 After Rebuilding, Test the Flow

1. Open your app on Android emulator
2. Go to sign-in screen
3. Click "Continue with Google"
4. Select your Google account
5. Grant permissions (if prompted)
6. **Expected:** Browser closes, app opens to home screen ✅

---

## 🐛 If Still Not Working: Debug Steps

### Test 1: Verify Intent Filter is Registered

```bash
adb shell dumpsys package com.starter.app | grep -A 10 "native"
```

**Expected output:** Should show `native` as a scheme under intent filters.

**If not showing:** Run `npx expo prebuild --clean && npx expo run:android` again.

### Test 2: Test Deep Link Manually

```bash
# Make sure app is running, then:
adb shell am start -W -a android.intent.action.VIEW -d "native://(tabs)"
```

**Expected:** App opens and navigates to tabs screen.

**If app doesn't open:** Intent filter not registered (rebuild needed).

### Test 3: Check Convex Backend Logs

```bash
# In a terminal, run:
pnpm dev:server
```

**Look for:**
- ✅ "Successfully authenticated" - OAuth worked
- ❌ "Invalid callbackURL" - Check `trustedOrigins` in backend
- ❌ "Redirect URI mismatch" - Check Google Console URIs

---

## 📋 Verification Checklist

Before testing, ensure:

- [ ] Ran `npx expo prebuild --clean`
- [ ] Ran `npx expo run:android` (not just `expo start`)
- [ ] App is freshly installed on emulator
- [ ] Convex backend is running (`pnpm dev:server`)
- [ ] Google Console has the TWO web redirect URIs (no `native://` needed)

---

## 🔍 Understanding the OAuth Flow

### Correct Flow (After Rebuild):
```
1. User clicks "Continue with Google"
   ↓
2. Opens Chrome → Google OAuth consent screen
   ↓
3. User selects account
   ↓
4. Google redirects to:
   https://wooden-porcupine-536.convex.site/api/auth/callback/google
   ↓
5. Your Convex backend processes OAuth tokens
   ↓
6. Backend responds with redirect to: native://(tabs)
   ↓
7. Android OS catches native:// via intent filter
   ↓
8. App opens and navigates to (tabs) screen
   ↓
9. ✅ Success! User is signed in
```

### What Was Happening Before:
```
Steps 1-5: Same as above
   ↓
6. Backend responds with redirect to: native://(tabs)
   ↓
7. ❌ Android doesn't recognize native:// (intent filter not registered)
   ↓
8. Browser stays open, shows Google account page
```

---

## 🎯 Summary

**The only thing you need to do:**

```bash
npx expo prebuild --clean && npx expo run:android
```

Your Google Console configuration is **already correct**. Your `app.json` configuration is **already correct**. You just need to rebuild the native Android project once to register the intent filters.

After rebuilding, Google OAuth should work perfectly! 🚀

## 🔴 Problem
After selecting a Google account during OAuth, the flow doesn't redirect back to your Expo app. Instead, it goes to a Google account settings/password screen.

## ✅ Root Cause Identified
**Google Cloud Console is missing the custom scheme redirect URI (`native://`) that your Expo app uses.**

Your current Google Console setup only has:
- ✅ `http://localhost:3000/api/auth/callback/google`
- ✅ `https://wooden-porcupine-536.convex.site/api/auth/callback/google`

But it's missing:
- ❌ `native://` (custom scheme URI for Expo app)

---

## 🔧 Solution - Follow These Steps

### ⚡ Step 1: Your Google Console Configuration is CORRECT ✅

**Good news:** Your current Google Console setup is actually **correct**! You should NOT add `native://` to Google Console.

**Your redirect URIs are already properly configured:**
```
✅ http://localhost:3000/api/auth/callback/google
✅ https://wooden-porcupine-536.convex.site/api/auth/callback/google
```

**Why no `native://` needed:**
- Google OAuth ONLY redirects to your **backend web URL** (the convex.site URL)
- Your backend (Better Auth) then redirects to your **app's custom scheme** (`native://`)
- Google never directly redirects to custom schemes - that's handled by Better Auth
- This is the correct OAuth flow for mobile apps

## 🔧 The Real Solution

### Problem Identified
The issue is that when you click on a Google account in the emulator, it's showing the Google account settings page instead of completing the OAuth flow. This happens because:

1. The OAuth flow opens in the Android Chrome browser
2. After selecting an account, Google tries to redirect to your backend
3. But the redirect context is lost or the browser doesn't properly redirect back

### Solution: Use ID Token Sign-In Instead

For **development on Android emulator**, Better Auth supports signing in with Google's ID token directly, which works better than the full OAuth redirect flow.

However, the **MAIN FIX** is simpler - you just need to rebuild your app to register the intent filters:

### Step 1: Rebuild Your App (CRITICAL)

Your `app.json` already has the correct configuration:
```json
{
  "expo": {
    "scheme": "native",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "native" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### 🔨 Step 3: Rebuild Your Android App (CRITICAL)

**⚠️ Important:** Intent filters are compiled into the Android manifest at build time. You MUST rebuild the native Android project:

```bash
# Stop any running dev servers first
# Then clean and rebuild

npx expo prebuild --clean
npx expo run:android
```

**❌ Don't do this:**
- Just restarting Expo dev server won't work
- Running `npx expo start` won't pick up the changes
- Reloading the app with `r` won't help

**✅ Do this:**
- Full native rebuild with `npx expo run:android`

### 🧪 Step 4: Test the OAuth Flow

1. Open your app on the Android emulator
2. Navigate to sign-in screen
3. Click **"Continue with Google"**
4. Select your Google account
5. Grant permissions if prompted
6. **You should now be redirected back to your app's home screen!**

---

## 🔍 Understanding the OAuth Flow

### ❌ Before Fix (What's Happening Now):
```
1. User clicks "Sign in with Google"
   ↓
2. Opens browser → Google OAuth consent screen
   ↓
3. User selects account
   ↓
4. Google authenticates → Redirects to:
   https://wooden-porcupine-536.convex.site/api/auth/callback/google
   ↓
5. Your backend processes OAuth tokens
   ↓
6. Backend tries to redirect to: native://(tabs)
   ↓
7. ❌ Google REJECTS: "native:// is not an authorized redirect URI"
   ↓
8. User sees Google account settings page instead
```

### ✅ After Fix (Expected Flow):
```
1. User clicks "Sign in with Google"
   ↓
2. Opens browser → Google OAuth consent screen
   ↓
3. User selects account
   ↓
4. Google authenticates → Redirects to:
   https://wooden-porcupine-536.convex.site/api/auth/callback/google
   ↓
5. Your backend processes OAuth tokens
   ↓
6. Backend redirects to: native://(tabs)
   ↓
7. ✅ Google ALLOWS: "native:// is in authorized redirect URIs"
   ↓
8. Android catches native:// scheme via intent filter
   ↓
9. App opens and navigates to (tabs) screen
   ↓
10. ✅ Success! User is signed in
```

---

## 🧪 Testing Deep Links (Optional Debug Step)

Test if your app can handle the `native://` scheme:

```bash
# Make sure your app is running
# Then run this in terminal:
adb shell am start -W -a android.intent.action.VIEW -d "native://(tabs)"
```

**Expected result:** Your app opens and navigates to the tabs screen.

If this doesn't work, the intent filter isn't properly registered (rebuild required).

### Verify Intent Filter Registration:
```bash
adb shell dumpsys package com.starter.app | grep -A 20 "android.intent.action.VIEW"
```

You should see `native` listed under schemes.

---

## 🐛 Troubleshooting

### Issue: Still showing "Redirect URI mismatch"
**Check:**
1. ✅ `native://` is added to Google Console redirect URIs
2. ✅ You clicked SAVE in Google Console
3. ✅ Wait a few seconds for Google's changes to propagate
4. ✅ Try the OAuth flow again

### Issue: App doesn't open after OAuth
**Solution:**
```bash
# Ensure you did a full native rebuild
npx expo prebuild --clean
npx expo run:android

# NOT just:
npx expo start  # ❌ This won't work
```

### Issue: Deep link test command fails
**Possible causes:**
1. App not installed or not running
2. Intent filter not registered (rebuild needed)
3. Wrong package name

**Verify package:**
```bash
adb shell pm list packages | grep starter
```
Should show: `com.starter.app`

### Issue: Works on iOS but not Android
- Android requires `intentFilters` in `app.json` ✅ (you have this)
- iOS only needs `scheme` field ✅ (you have this)
- Both platforms need native rebuild after `app.json` changes

### Issue: "Invalid callbackURL" in Convex logs
**Check backend trustedOrigins:**
```typescript
trustedOrigins: [
  "native://",     // ✅ Should be here
  "exp://",        // ✅ For Expo Go development
  "http://localhost:8081", // ✅ For metro bundler
]
```

---

## 📚 Why This Happens - Technical Details

### Google OAuth Security
Google OAuth enforces strict redirect URI validation:
- **Web URLs** must match exactly (protocol, domain, path)
- **Custom scheme URIs** (like `native://`, `myapp://`) must be explicitly registered
- Without registration, Google **blocks the redirect for security**

### Expo Deep Linking
Expo apps use custom URL schemes for deep linking:
- Defined in `app.json` with `"scheme": "native"`
- Creates URIs like `native://path/to/screen`
- Android requires `intentFilters` to handle these URLs
- iOS handles this automatically

### Better Auth + Expo Flow
Better Auth's Expo plugin:
- Configures the OAuth callback to use your custom scheme
- Sets `callbackURL: "native://(tabs)"` during OAuth
- Expects the backend to redirect to this custom scheme
- Android/iOS catches the URL and opens your app

---

## 📖 References & Documentation

- **Better Auth Expo Plugin:** https://better-auth.com/docs/plugins/expo
- **Better Auth Issue #3781:** https://github.com/better-auth/better-auth/issues/3781 (exact same problem)
- **Expo Deep Linking:** https://docs.expo.dev/guides/deep-linking/
- **Google OAuth Custom Schemes:** https://developers.google.com/identity/protocols/oauth2/native-app
- **Android Intent Filters:** https://developer.android.com/training/app-links/deep-linking

---

## ✅ Final Checklist

Before testing, ensure all of these are done:

- [ ] Added `native://` to Google Console **Authorized redirect URIs**
- [ ] Clicked **SAVE** in Google Console
- [ ] Waited 10-30 seconds for Google changes to propagate
- [ ] Stopped all Expo dev servers
- [ ] Ran `npx expo prebuild --clean`
- [ ] Ran `npx expo run:android` (not `expo start`)
- [ ] App is freshly installed on emulator/device
- [ ] Convex backend is running (`pnpm dev:server`)
- [ ] Can see your backend logs in terminal

---

## 🎉 Expected Result

After following all steps:

1. Click **"Continue with Google"**
2. Google account selection appears
3. Select your account
4. (Optional) Grant permissions
5. **Browser closes automatically**
6. **Your app opens to the home screen**
7. **You see your name and email displayed**
8. **Success toast appears: "Welcome! You've successfully signed in with Google"**

---

## 📞 Still Not Working?

### Enable Debug Logging

**Terminal 1 - Convex Backend Logs:**
```bash
pnpm dev:server
```

**Terminal 2 - Android Logs:**
```bash
npx react-native log-android
```

**What to look for:**
- ❌ "Invalid callbackURL" → Check `trustedOrigins` in backend
- ❌ "Redirect URI mismatch" → Check Google Console redirect URIs
- ✅ "Successfully authenticated" → OAuth succeeded
- Look for deep link events in Android logs

### Test in Isolation

**Test 1: Deep linking works**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "native://(tabs)"
```
✅ Should open your app

**Test 2: Backend OAuth endpoint works**
Visit in browser: `https://wooden-porcupine-536.convex.site/api/auth/sign-in/social`
✅ Should show OAuth config (not an error)

**Test 3: Convex backend accessible**
```bash
curl https://wooden-porcupine-536.convex.site/api/auth/session
```
✅ Should return session data or null

---

## 🔑 The Key Insight

From Better Auth GitHub issue #3781:

> "Expo apps using Better Auth for Google OAuth require the **custom scheme URI** (like `native://`) to be registered as a redirect URI in Google Cloud Console, **not just the web callback URL**. This is because the OAuth flow completes on your backend, then redirects to your app using the custom scheme."

Your backend URL (`https://wooden-porcupine-536.convex.site/api/auth/callback/google`) handles the OAuth callback from Google, but then it needs to redirect to your app (`native://(tabs)`). Google needs to allow **both** URLs.

---

**Good luck! This should fix your issue. 🚀**

## Problem Summary

When clicking Google sign-in on Android, the OAuth flow opens Google account selection, but after selecting an account, it redirects to Google's account settings page instead of returning to the Expo app.

## Root Cause

Better Auth's Expo plugin requires a **custom scheme redirect URI** (like `native://auth/callback/google`) to be registered in Google Cloud Console. The current setup only has web URLs registered, causing a redirect URI mismatch.

**How Better Auth Expo OAuth works:**
1. User clicks "Sign in with Google" in Expo app
2. Better Auth opens browser with Google OAuth (using your backend URL)
3. User authenticates with Google
4. Google redirects to your backend: `https://wooden-porcupine-536.convex.site/api/auth/callback/google`
5. Backend processes OAuth and redirects to deep link: `native://(tabs)` (or whatever callbackURL you specified)
6. Android opens your app via the `native://` scheme

**The issue:** Google needs to know about the custom scheme redirect URI to allow Better Auth to redirect back to your app.

## Required Changes

### 1. Add Custom Scheme Redirect URI to Google Cloud Console

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID (currently configured as "Web application")
4. Under "Authorized redirect URIs", click "ADD URI"
5. Add: `native://auth/callback/google`
6. Click "SAVE"

**Your updated redirect URIs should be:**
- `http://localhost:3000/api/auth/callback/google` (for web dev)
- `https://wooden-porcupine-536.convex.site/api/auth/callback/google` (for backend)
- `native://auth/callback/google` ✨ **NEW - Required for Expo**

### 2. Android Intent Filter Configuration

The `app.json` has been updated with the Android intent filter to handle `native://` deep links:

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "native" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

This tells Android that your app can handle URLs starting with `native://`.

### 3. Rebuild the App

**CRITICAL:** After changing `app.json`, you must rebuild the app for the intent filter to take effect:

```bash
# For development build
npx expo prebuild --clean
npx expo run:android

# OR if using EAS Build
eas build --profile development --platform android
```

Simply restarting the dev server is **NOT sufficient** - the intent filter is baked into the Android manifest during build time.

## Testing the Fix

### Test Deep Linking (Before OAuth)

Test that your app can handle deep links:

```bash
# With app running on Android emulator/device:
adb shell am start -W -a android.intent.action.VIEW -d "native://(tabs)"
```

Expected: Your app should open and navigate to the (tabs) route.

### Test Google OAuth Flow

1. Open your Expo app on Android
2. Tap "Sign in with Google"
3. Select a Google account
4. Expected flow:
   - Google sign-in page opens in browser
   - After authentication, browser should close
   - Your app should come back to foreground
   - User should be signed in and redirected to `(tabs)` route

## Common Issues & Solutions

### Issue: "redirect_uri_mismatch" error from Google

**Solution:** Double-check that `native://auth/callback/google` is added to Google Console redirect URIs.

### Issue: App doesn't open after Google auth

**Solution:** 
1. Verify you rebuilt the app after adding intent filters
2. Check that the scheme in `app.json` matches the scheme in Better Auth client (`native`)
3. Test deep linking with adb command above

### Issue: "No Activity found to handle Intent"

**Solution:** Rebuild the app - intent filters weren't applied.

### Issue: OAuth works in Expo Go but not in dev build

**Solution:** Expo Go uses a different scheme (`exp://`). Use a development build for OAuth testing.

## Architecture Reference

**Backend (packages/backend/convex/auth.ts):**
```typescript
trustedOrigins: [
  "native://",     // Production Expo app scheme ✅
  "exp://",        // Expo Go development
  "http://localhost:8081", // Metro bundler
]
```

**Frontend (apps/native/lib/auth/client.ts):**
```typescript
expoClient({
  scheme: Constants.expoConfig?.scheme, // "native" from app.json
  storagePrefix: Constants.expoConfig?.scheme,
  storage: SecureStore,
})
```

**Hook (apps/native/lib/auth/hooks/use-google-sign-in.ts):**
```typescript
await authClient.signIn.social({
  provider: "google",
  callbackURL: "native://(tabs)", // Will be used by Better Auth to redirect back
})
```

## Why This Configuration Works

1. **Google Console:** Allows Better Auth backend to redirect to `native://auth/callback/google`
2. **Intent Filter:** Tells Android your app handles `native://` URLs
3. **Better Auth Backend:** Configured with `trustedOrigins: ["native://"]` to accept redirects
4. **Better Auth Client:** Uses `scheme: "native"` to construct deep links
5. **OAuth Flow:** Backend processes OAuth, then redirects to your app via `native://(tabs)`

## Additional Notes

- **Web vs Native Client IDs:** For most cases, you can use a single "Web application" client ID for both web and mobile (as Better Auth handles OAuth on the backend). You don't need separate Android/iOS OAuth client IDs in Google Console.

- **Production vs Development:** The same redirect URI (`native://auth/callback/google`) works for both development and production builds since the scheme is the same.

- **Alternative: Using idToken Flow:** If you prefer, you can use Google's native SDKs (`@react-native-google-signin/google-signin`) to get an idToken, then pass it to Better Auth using `authClient.signIn.social({ provider: "google", idToken: { token } })`. This avoids the redirect flow entirely.

## References

- [Better Auth Expo Documentation](https://www.better-auth.com/docs/integrations/expo)
- [Better Auth GitHub Issue #3781](https://github.com/better-auth/better-auth/issues/3781) (Same issue)
- [Expo Deep Linking Guide](https://docs.expo.dev/guides/deep-linking/)
