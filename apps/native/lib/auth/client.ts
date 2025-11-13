import { expoClient } from "@better-auth/expo/client"
import { convexClient } from "@convex-dev/better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import Constants from "expo-constants"
import * as SecureStore from "expo-secure-store"

/**
 * Better Auth client for Expo app
 * Configured with Expo and Convex plugins for authentication
 *
 * @see https://convex-better-auth.netlify.app/framework-guides/expo
 */
export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
    convexClient(),
  ],
})

/**
 * Infer user type from Better Auth client
 * Use this type throughout your Expo app for type safety
 */
export type User = NonNullable<Awaited<ReturnType<typeof authClient.getSession>>>["user"]

/**
 * Infer session type from Better Auth client
 * Use this type throughout your Expo app for type safety
 */
export type Session = NonNullable<Awaited<ReturnType<typeof authClient.getSession>>>["session"]
