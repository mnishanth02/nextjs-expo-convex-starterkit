import { useQuery } from "convex/react"
import type { FunctionReference } from "convex/server"
import { authClient } from "./client"

/**
 * Hook to check authentication state and get user info
 * Works in both Next.js and React Native
 *
 * @example
 * ```tsx
 * function Profile() {
 *   const { isAuthenticated, isLoading, user } = useAuthState()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (!isAuthenticated) return <div>Please sign in</div>
 *
 *   return <div>Hello {user?.name}</div>
 * }
 * ```
 */
export function useAuthState() {
  const { data: session, isPending, error } = authClient.useSession()

  return {
    isAuthenticated: Boolean(session && !isPending),
    isLoading: isPending,
    user: session?.user ?? null,
    session: session?.session ?? null,
    error,
  }
}

/**
 * Authenticated query hook - automatically skips query if user is not authenticated
 * Useful for queries that require authentication to avoid unnecessary API calls
 *
 * @example
 * ```tsx
 * import { api } from "@repo/backend/convex/_generated/api"
 *
 * function UserDashboard() {
 *   const userData = useAuthenticatedQuery(api.users.getCurrentUserData, {})
 *
 *   if (userData === undefined) return <div>Loading...</div>
 *   if (userData === null) return <div>Not authenticated</div>
 *
 *   return <div>Welcome {userData.name}</div>
 * }
 * ```
 */
export function useAuthenticatedQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args?: Record<string, unknown>
) {
  const { data: session, isPending } = authClient.useSession()

  // Skip the query if we're still loading auth state or user is not authenticated
  const shouldSkip = isPending || !session

  // biome-ignore lint/suspicious/noExplicitAny: Convex query args are dynamically typed
  return useQuery(query, (shouldSkip ? "skip" : args) as any)
}

/**
 * Get current user ID synchronously
 * Useful when you need the user ID immediately without waiting for a query
 *
 * @returns User ID or null if not authenticated
 *
 * @example
 * ```tsx
 * function CreatePost() {
 *   const userId = useUserId()
 *
 *   const handleSubmit = async () => {
 *     if (!userId) {
 *       alert('Please sign in')
 *       return
 *     }
 *     // Create post with userId
 *   }
 * }
 * ```
 */
export function useUserId(): string | null {
  const { user } = useAuthState()
  return user?.id ?? null
}

/**
 * Check if user is authenticated (boolean)
 * Convenient shorthand for checking auth status
 *
 * @example
 * ```tsx
 * function ProtectedButton() {
 *   const isAuthenticated = useIsAuthenticated()
 *
 *   return (
 *     <button disabled={!isAuthenticated}>
 *       {isAuthenticated ? 'Submit' : 'Sign in to submit'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuthState()
  return isAuthenticated
}
