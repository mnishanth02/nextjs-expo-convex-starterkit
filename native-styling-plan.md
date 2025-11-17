# Gluestack UI v3 Implementation Plan for React Native App (2025)

**Last Updated:** November 16, 2025  
**Target App:** `apps/native` (Expo 54 + React Native 0.81)  
**Gluestack Version:** v3 with NativeWind (Tailwind CSS for React Native)  
**Status:** Planning Phase

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Decision](#architecture-decision)
3. [Prerequisites](#prerequisites)
4. [Phase 1: NativeWind Setup](#phase-1-nativewind-setup)
5. [Phase 2: Gluestack UI Installation](#phase-2-gluestack-ui-installation)
6. [Phase 3: Component Library Setup](#phase-3-component-library-setup)
7. [Phase 4: Migration Strategy](#phase-4-migration-strategy)
8. [Phase 5: Testing & Validation](#phase-5-testing--validation)
9. [Project Structure](#project-structure)
10. [Configuration Files](#configuration-files)
11. [Common Patterns](#common-patterns)
12. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Gluestack UI v3?

Gluestack UI v3 is a universal component library built on **NativeWind** (TailwindCSS for React Native). It provides:
- 40+ unstyled, accessible components
- Unified styling across web and mobile via Tailwind classes
- Type-safe component APIs with TypeScript
- Dark mode support out of the box
- Animation support via Moti/Reanimated
- RSC (React Server Components) compatible

### Why Gluestack UI?

1. **Unified Styling:** Use Tailwind CSS classes in React Native (same as web)
2. **Headless Components:** Full control over styling while maintaining accessibility
3. **Type Safety:** Full TypeScript support with IntelliSense
4. **Performance:** Optimized for React Native 0.81+ New Architecture
5. **Design System Ready:** Easy to create consistent design tokens

---

## Architecture Decision

### Current State
- **Web App:** Uses Radix UI (`@repo/webui`) with Tailwind CSS 4
- **Native App:** Uses custom components with StyleSheet API

### Target State
- **Web App:** Keep Radix UI (no changes)
- **Native App:** Migrate to Gluestack UI v3 + NativeWind
- **Shared Package:** Create `@repo/native-ui` for Gluestack components (parallel to `@repo/webui`)

### Why Separate Packages?

```
packages/
  web-ui/       # Radix UI components (web only)
  native-ui/    # Gluestack UI components (native only)
  types/        # Shared types (cross-platform)
  utils/        # Shared utils (cross-platform)
```

This approach:
- Avoids platform-specific imports in shared packages
- Maintains clear separation of concerns
- Allows independent versioning
- Prevents bundling issues with React Native metro bundler

---

## Prerequisites

### Current Dependencies (apps/native)
- ✅ React 19.1.0
- ✅ React Native 0.81.5
- ✅ Expo 54
- ✅ New Architecture enabled
- ✅ React Native Reanimated ~4.1.1
- ✅ React Native Gesture Handler ~2.28.0

### Required Additions
- NativeWind v4
- Tailwind CSS v3.4+
- Gluestack UI v3 packages
- Moti (optional, for advanced animations)

---

## Phase 1: NativeWind Setup

### Step 1.1: Install NativeWind Dependencies

```bash
cd apps/native
pnpm add nativewind@^4.1.23 tailwindcss@^3.4.1
pnpm add -D tailwindcss@^3.4.1
```

### Step 1.2: Create Tailwind Config

**File:** `apps/native/tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify content paths for Tailwind to scan
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  
  // Enable dark mode support
  darkMode: "class",
  
  theme: {
    extend: {
      colors: {
        // Align with your design system
        primary: {
          50: "#E6F4FE",
          100: "#CCE9FD",
          500: "#0A7EFF",
          600: "#0066CC",
          700: "#004D99",
          900: "#002B55",
        },
        secondary: {
          50: "#F5F5F5",
          500: "#6B7280",
          900: "#1F2937",
        },
      },
      fontFamily: {
        // Match your existing font setup
        regular: ["System"],
        medium: ["System"],
        semibold: ["System"],
        bold: ["System"],
      },
    },
  },
  
  plugins: [],
}
```

### Step 1.3: Update Metro Config

**File:** `apps/native/metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Wrap with NativeWind configuration
module.exports = withNativeWind(config, {
  input: "./global.css", // Global CSS entry point
  configPath: "./tailwind.config.js",
});
```

### Step 1.4: Create Global CSS

**File:** `apps/native/global.css`

```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom component styles (optional) */
@layer components {
  .btn-primary {
    @apply bg-primary-500 text-white px-4 py-2 rounded-lg;
  }
}
```

### Step 1.5: Import Global CSS

**File:** `apps/native/app/_layout.tsx`

```tsx
// Import global CSS at the very top
import "../global.css";

import { ConvexBetterAuthProvider } from "@/components/providers/convex-client-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ConvexBetterAuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      <StatusBar style="auto" />
    </ConvexBetterAuthProvider>
  );
}
```

### Step 1.6: Update TypeScript Config

**File:** `apps/native/app.json` (add NativeWind plugin)

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      ["expo-splash-screen", { ... }],
      "expo-secure-store",
      "nativewind/expo"
    ]
  }
}
```

**File:** `apps/native/expo-env.d.ts`

```typescript
/// <reference types="nativewind/types" />
```

### Step 1.7: Test NativeWind

Create a test component to verify NativeWind is working:

**File:** `apps/native/components/test-nativewind.tsx`

```tsx
import { Text, View } from "react-native";

export function TestNativeWind() {
  return (
    <View className="flex-1 items-center justify-center bg-primary-50 dark:bg-primary-900">
      <Text className="text-2xl font-bold text-primary-700 dark:text-primary-100">
        NativeWind is working! 🎉
      </Text>
      <View className="mt-4 px-6 py-3 bg-primary-500 rounded-lg">
        <Text className="text-white font-semibold">Styled Button</Text>
      </View>
    </View>
  );
}
```

---

## Phase 2: Gluestack UI Installation

### Step 2.1: Install Core Packages

```bash
cd apps/native
pnpm add @gluestack-ui/nativewind-utils
pnpm add @gluestack-ui/themed@next
```

### Step 2.2: Install Individual Components (As Needed)

Gluestack UI v3 uses a modular approach - install only what you need:

```bash
# Core components (most commonly used)
pnpm add @gluestack-ui/button
pnpm add @gluestack-ui/input
pnpm add @gluestack-ui/text
pnpm add @gluestack-ui/box
pnpm add @gluestack-ui/center
pnpm add @gluestack-ui/hstack
pnpm add @gluestack-ui/vstack
pnpm add @gluestack-ui/pressable

# Form components
pnpm add @gluestack-ui/checkbox
pnpm add @gluestack-ui/radio
pnpm add @gluestack-ui/select
pnpm add @gluestack-ui/slider
pnpm add @gluestack-ui/switch
pnpm add @gluestack-ui/textarea

# Feedback components
pnpm add @gluestack-ui/alert
pnpm add @gluestack-ui/alert-dialog
pnpm add @gluestack-ui/modal
pnpm add @gluestack-ui/toast
pnpm add @gluestack-ui/spinner
pnpm add @gluestack-ui/progress

# Navigation components
pnpm add @gluestack-ui/tabs
pnpm add @gluestack-ui/menu
pnpm add @gluestack-ui/popover

# Display components
pnpm add @gluestack-ui/avatar
pnpm add @gluestack-ui/badge
pnpm add @gluestack-ui/card
pnpm add @gluestack-ui/divider
pnpm add @gluestack-ui/icon
pnpm add @gluestack-ui/image

# Overlay components
pnpm add @gluestack-ui/actionsheet
pnpm add @gluestack-ui/tooltip
```

### Step 2.3: Update Tailwind Config for Gluestack

**File:** `apps/native/tailwind.config.js`

```js
const { gluestackUIPlugin } = require("@gluestack-ui/nativewind-utils/tailwind-plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  
  darkMode: "class",
  
  theme: {
    extend: {
      colors: {
        primary: {
          0: "#FFFFFF",
          50: "#E6F4FE",
          100: "#CCE9FD",
          200: "#99D3FB",
          300: "#66BDF9",
          400: "#33A7F7",
          500: "#0A7EFF", // Main primary
          600: "#0066CC",
          700: "#004D99",
          800: "#003366",
          900: "#002B55",
          950: "#001A33",
        },
        secondary: {
          0: "#FFFFFF",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
        // Add more color tokens as needed
      },
      fontFamily: {
        regular: ["System"],
        medium: ["System"],
        semibold: ["System"],
        bold: ["System"],
      },
    },
  },
  
  plugins: [gluestackUIPlugin],
}
```

### Step 2.4: Create Gluestack Provider

**File:** `apps/native/components/providers/gluestack-provider.tsx`

```tsx
import { GluestackUIProvider } from "@gluestack-ui/themed";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function GluestackProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  
  return (
    <GluestackUIProvider mode={colorScheme ?? "light"}>
      {children}
    </GluestackUIProvider>
  );
}
```

### Step 2.5: Wrap App with Provider

**File:** `apps/native/app/_layout.tsx`

```tsx
import "../global.css";

import { ConvexBetterAuthProvider } from "@/components/providers/convex-client-provider";
import { GluestackProvider } from "@/components/providers/gluestack-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ConvexBetterAuthProvider>
      <GluestackProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
        <StatusBar style="auto" />
      </GluestackProvider>
    </ConvexBetterAuthProvider>
  );
}
```

---

## Phase 3: Component Library Setup

### Step 3.1: Create Native UI Package

```bash
mkdir -p packages/native-ui/src/components
cd packages/native-ui
```

**File:** `packages/native-ui/package.json`

```json
{
  "name": "@repo/native-ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.tsx"
  },
  "scripts": {
    "lint": "biome check .",
    "format": "biome format --write ."
  },
  "dependencies": {
    "@gluestack-ui/button": "^1.0.7",
    "@gluestack-ui/input": "^0.1.32",
    "@gluestack-ui/text": "^0.1.13",
    "@gluestack-ui/box": "^0.1.9",
    "@gluestack-ui/center": "^0.1.16",
    "@gluestack-ui/hstack": "^0.1.7",
    "@gluestack-ui/vstack": "^0.1.7",
    "@gluestack-ui/pressable": "^0.1.16",
    "@gluestack-ui/icon": "^0.1.23",
    "@gluestack-ui/nativewind-utils": "^1.1.27",
    "@gluestack-ui/themed": "^1.1.55",
    "nativewind": "^4.1.23",
    "react": "19.1.0",
    "react-native": "0.81.5"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "typescript": "~5.9.2"
  },
  "peerDependencies": {
    "react": "19.1.0",
    "react-native": "0.81.5"
  }
}
```

**File:** `packages/native-ui/tsconfig.json`

```json
{
  "extends": "@repo/config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "jsx": "react-native"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 3.2: Create Base Components

**File:** `packages/native-ui/src/components/button.tsx`

```tsx
import {
  Button as GluestackButton,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
} from "@gluestack-ui/button";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof GluestackButton> & {
  isLoading?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
};

export function Button({
  children,
  isLoading,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) {
  return (
    <GluestackButton
      className={`px-6 py-3 rounded-lg ${className ?? ""}`}
      {...props}
    >
      {isLoading && <ButtonSpinner className="mr-2" />}
      {!isLoading && leftIcon && (
        <ButtonIcon as={leftIcon} className="mr-2" />
      )}
      <ButtonText className="font-semibold">{children}</ButtonText>
      {!isLoading && rightIcon && (
        <ButtonIcon as={rightIcon} className="ml-2" />
      )}
    </GluestackButton>
  );
}
```

**File:** `packages/native-ui/src/components/input.tsx`

```tsx
import {
  Input as GluestackInput,
  InputField,
  InputSlot,
  InputIcon,
} from "@gluestack-ui/input";
import type { ComponentProps } from "react";

type InputProps = ComponentProps<typeof InputField> & {
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  containerClassName?: string;
};

export function Input({
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <GluestackInput
      className={`border border-gray-300 rounded-lg ${containerClassName ?? ""}`}
    >
      {leftIcon && (
        <InputSlot className="pl-3">
          <InputIcon as={leftIcon} />
        </InputSlot>
      )}
      <InputField
        className={`px-4 py-3 ${className ?? ""}`}
        {...props}
      />
      {rightIcon && (
        <InputSlot className="pr-3">
          <InputIcon as={rightIcon} />
        </InputSlot>
      )}
    </GluestackInput>
  );
}
```

**File:** `packages/native-ui/src/components/card.tsx`

```tsx
import { Box } from "@gluestack-ui/box";
import type { ComponentProps } from "react";

type CardProps = ComponentProps<typeof Box>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <Box
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md ${className ?? ""}`}
      {...props}
    >
      {children}
    </Box>
  );
}
```

**File:** `packages/native-ui/src/index.ts`

```typescript
// Export all components
export { Button } from "./components/button";
export { Input } from "./components/input";
export { Card } from "./components/card";

// Re-export commonly used Gluestack components
export {
  Box,
  Center,
  HStack,
  VStack,
} from "@gluestack-ui/themed";

export { Text } from "@gluestack-ui/text";
export { Pressable } from "@gluestack-ui/pressable";
```

### Step 3.3: Add to Workspace

**File:** `apps/native/package.json` (add dependency)

```json
{
  "dependencies": {
    "@repo/native-ui": "workspace:*",
    // ... other deps
  }
}
```

Run `pnpm install` from root to link the package.

---

## Phase 4: Migration Strategy

### Step 4.1: Migration Priority

Migrate components in this order:

1. **Basic UI Elements** (Week 1)
   - Button
   - Text
   - Input
   - Box/Container

2. **Layout Components** (Week 1)
   - HStack/VStack
   - Center
   - Divider

3. **Form Components** (Week 2)
   - Auth forms (sign-in, sign-up)
   - Form fields with validation
   - Error messages

4. **Complex Components** (Week 2-3)
   - Cards
   - Tabs
   - Modals
   - Toast notifications

5. **Navigation** (Week 3)
   - Tab bar
   - Header components

### Step 4.2: Example Migration - Sign In Form

**Before:** `apps/native/components/auth/sign-in-form.tsx`

```tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 16, borderRadius: 8 },
  button: { backgroundColor: "#0A7EFF", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" },
});
```

**After:** `apps/native/components/auth/sign-in-form.tsx`

```tsx
import { useState } from "react";
import { View } from "react-native";
import { Button, Input, Text, VStack } from "@repo/native-ui";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <VStack className="p-5 gap-4">
      <Text className="text-2xl font-bold mb-2">Sign In</Text>
      
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button className="bg-primary-500 active:bg-primary-600">
        Sign In
      </Button>
    </VStack>
  );
}
```

### Step 4.3: Migration Checklist

For each component:

- [ ] Identify StyleSheet usage
- [ ] Map styles to Tailwind classes
- [ ] Replace React Native primitives with Gluestack components
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test dark mode
- [ ] Test accessibility (screen reader)
- [ ] Update Biome formatting

---

## Phase 5: Testing & Validation

### Step 5.1: Manual Testing Checklist

Test each migrated screen:

- [ ] **Layout:** Component renders correctly
- [ ] **Styling:** Matches design specs
- [ ] **Dark Mode:** Colors adapt correctly
- [ ] **Interactions:** Buttons/inputs respond
- [ ] **Navigation:** Routes work as expected
- [ ] **Forms:** Validation and submission work
- [ ] **Accessibility:** VoiceOver/TalkBack compatible
- [ ] **Performance:** No lag or jank

### Step 5.2: Platform-Specific Testing

**iOS:**
```bash
pnpm --filter native ios
```

**Android:**
```bash
pnpm --filter native android
```

**Web (optional):**
```bash
pnpm --filter native web
```

### Step 5.3: E2E Testing (Future)

Consider adding E2E tests with Detox or Maestro once migration is complete.

---

## Project Structure

### Final Structure

```
apps/
  native/
    app/
      _layout.tsx              # Root layout with providers
      index.tsx
      (auth)/
        sign-in.tsx            # Migrated with Gluestack
        sign-up.tsx            # Migrated with Gluestack
      (tabs)/
        _layout.tsx            # Tab bar with Gluestack
        index.tsx
        explore.tsx
    components/
      auth/
        sign-in-form.tsx       # Uses @repo/native-ui
      providers/
        gluestack-provider.tsx # Gluestack setup
        convex-client-provider.tsx
      ui/
        (custom components using Gluestack primitives)
    lib/
      styles/
        theme.ts               # Design tokens
    global.css                 # Tailwind directives
    tailwind.config.js         # Tailwind + Gluestack config
    metro.config.js            # Metro with NativeWind
    package.json

packages/
  native-ui/
    src/
      components/
        button.tsx
        input.tsx
        card.tsx
        // ... more components
      index.ts
    package.json
    tsconfig.json

  web-ui/
    # Unchanged (Radix UI for web)

  types/
    # Unchanged (shared types)

  utils/
    # Unchanged (shared utils)
```

---

## Configuration Files

### Key Files Reference

| File | Purpose |
|------|---------|
| `apps/native/tailwind.config.js` | Tailwind configuration with Gluestack plugin |
| `apps/native/metro.config.js` | Metro bundler with NativeWind integration |
| `apps/native/global.css` | Global styles and Tailwind directives |
| `apps/native/app/_layout.tsx` | Root layout with providers |
| `packages/native-ui/package.json` | Native UI package dependencies |
| `packages/native-ui/src/index.ts` | Component exports |

---

## Common Patterns

### Pattern 1: Button with Loading State

```tsx
import { Button } from "@repo/native-ui";
import { useState } from "react";

export function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      isLoading={isLoading}
      onPress={() => setIsLoading(true)}
      className="bg-primary-500"
    >
      Submit
    </Button>
  );
}
```

### Pattern 2: Form Field with Error

```tsx
import { Input, Text, VStack } from "@repo/native-ui";

export function EmailField({ error }: { error?: string }) {
  return (
    <VStack className="gap-1">
      <Input
        placeholder="Email"
        keyboardType="email-address"
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}
    </VStack>
  );
}
```

### Pattern 3: Conditional Dark Mode Styling

```tsx
import { Box } from "@repo/native-ui";

export function ThemedCard() {
  return (
    <Box className="bg-white dark:bg-gray-900 p-4 rounded-lg">
      {/* Content */}
    </Box>
  );
}
```

### Pattern 4: Responsive Layout

```tsx
import { HStack, VStack } from "@repo/native-ui";
import { useWindowDimensions } from "react-native";

export function ResponsiveLayout() {
  const { width } = useWindowDimensions();
  const Stack = width > 768 ? HStack : VStack;

  return (
    <Stack className="gap-4 p-4">
      {/* Content */}
    </Stack>
  );
}
```

---

## Troubleshooting

### Issue 1: "Invalid hook call" Error

**Cause:** Multiple React versions in node_modules

**Fix:**
```bash
cd apps/native
pnpm list react
# If you see multiple versions:
pnpm dedupe
```

### Issue 2: Tailwind Classes Not Working

**Cause:** NativeWind not configured properly

**Fix:**
1. Verify `global.css` is imported in `_layout.tsx`
2. Check `metro.config.js` has `withNativeWind` wrapper
3. Clear Metro cache: `pnpm --filter native start --clear`
4. Rebuild: `pnpm --filter native prebuild`

### Issue 3: Dark Mode Not Switching

**Cause:** GluestackProvider not syncing with system

**Fix:**
```tsx
// In gluestack-provider.tsx
import { useColorScheme } from "@/hooks/use-color-scheme";

export function GluestackProvider({ children }) {
  const colorScheme = useColorScheme(); // Use custom hook
  
  return (
    <GluestackUIProvider mode={colorScheme ?? "light"}>
      {children}
    </GluestackUIProvider>
  );
}
```

### Issue 4: TypeScript Errors with NativeWind

**Cause:** Missing type definitions

**Fix:**
Add to `apps/native/expo-env.d.ts`:
```typescript
/// <reference types="nativewind/types" />
```

### Issue 5: Metro Build Fails After Adding Components

**Cause:** Circular dependencies or missing peer deps

**Fix:**
```bash
# Check dependency tree
pnpm why <package-name>

# Clear caches
pnpm --filter native start --clear
rm -rf node_modules/.cache

# Reinstall
pnpm install
```

### Issue 6: Gluestack Components Not Rendering

**Cause:** Missing provider wrapper

**Fix:**
Ensure `_layout.tsx` wraps app with `GluestackProvider`:
```tsx
<GluestackProvider>
  <Stack>{/* routes */}</Stack>
</GluestackProvider>
```

---

## Timeline & Milestones

### Week 1: Setup & Foundation
- [ ] Install NativeWind
- [ ] Configure Tailwind
- [ ] Setup Metro with CSS support
- [ ] Create `@repo/native-ui` package
- [ ] Test basic styling

### Week 2: Core Components
- [ ] Migrate Button component
- [ ] Migrate Input component
- [ ] Migrate Text component
- [ ] Migrate layout components (HStack, VStack, Box)
- [ ] Update auth forms

### Week 3: Advanced Components
- [ ] Migrate Card component
- [ ] Migrate Modal/Dialog
- [ ] Migrate Toast notifications
- [ ] Update tab navigation

### Week 4: Testing & Polish
- [ ] Test all screens on iOS
- [ ] Test all screens on Android
- [ ] Test dark mode
- [ ] Test accessibility
- [ ] Document component usage
- [ ] Update README

---

## Resources

### Documentation
- [Gluestack UI v3 Docs](https://gluestack.io/ui/docs/home/overview/introduction)
- [NativeWind v4 Docs](https://www.nativewind.dev/v4/overview)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Expo SDK 54 Docs](https://docs.expo.dev/)

### Community
- [Gluestack Discord](https://discord.gg/gluestack)
- [NativeWind Discord](https://discord.gg/nativewind)

### Examples
- [Gluestack UI Examples](https://gluestack.io/ui/docs/home/getting-started/examples)
- [NativeWind Starter Template](https://github.com/nativewind/nativewind/tree/main/examples/expo-router)

---

## Notes

- **Web app unchanged:** Continue using Radix UI (`@repo/webui`) for the Next.js app
- **Shared types:** Keep `@repo/types` platform-agnostic (no React Native imports)
- **Biome formatting:** All new code must pass `pnpm format` and `pnpm check`
- **React 19:** Ensure all Gluestack components are compatible
- **New Architecture:** Verify components work with React Native 0.81+ New Arch

---

## Next Steps

1. Review and approve this plan
2. Create feature branch: `feat/gluestack-ui-integration`
3. Follow Phase 1 (NativeWind setup)
4. Validate with test components
5. Proceed to Phase 2 (Gluestack installation)

---

**Last Updated:** November 16, 2025  
**Status:** ✅ Plan Complete - Ready for Implementation