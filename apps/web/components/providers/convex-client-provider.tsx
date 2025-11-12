"use client"

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { ConvexReactClient } from "convex/react"
import type { ReactNode } from "react"
import { authClient } from "@/lib/auth-client"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  //TODO - remove this later- Optionally pause queries until the user is authenticated
  expectAuth: false,
})

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  )
}
