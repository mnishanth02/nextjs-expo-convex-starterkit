import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { ConvexReactClient } from "convex/react"
import type { ReactNode } from "react"
import { authClient } from "@/lib/auth/client"

// Convex URL should be loaded from environment variables
// For Expo, use app.config.ts or .env files
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL

if (!CONVEX_URL) {
  throw new Error("Missing EXPO_PUBLIC_CONVEX_URL environment variable")
}

const convex = new ConvexReactClient(CONVEX_URL, {
  // Don't require auth for initial queries - let Better Auth handle it
  expectAuth: false,
  unsavedChangesWarning: false,
})

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  )
}
