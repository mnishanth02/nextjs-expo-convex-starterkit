"use client"

import { api } from "@repo/backend/convex/_generated/api"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Protected layout - Requires authentication
 * Redirects to /sign-in if user is not authenticated
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const currentUser = useQuery(api.auth.getCurrentUser)

  useEffect(() => {
    // If query has completed and user is null, redirect to sign-in
    if (currentUser === null) {
      router.push("/sign-in")
    }
  }, [currentUser, router])

  // Show loading state while checking authentication
  if (currentUser === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // User is null - will redirect in useEffect
  if (currentUser === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  // User is authenticated - render protected content
  return <>{children}</>
}
