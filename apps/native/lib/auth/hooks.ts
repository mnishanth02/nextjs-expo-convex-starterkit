import type { AuthState } from "@repo/types/auth"
import { useQuery } from "convex/react"
import type { FunctionReference } from "convex/server"
import type { Session, User } from "./client"
import { authClient } from "./client"

/**
 * Hook to check authentication state and get user info
 * Expo-specific implementation using Better Auth React hooks
 *
 * @example
 * ```tsx
 * function Profile() {
 *   const { isAuthenticated, isLoading, user } = useAuthState()
 *
 *   if (isLoading) return <Text>Loading...</Text>
 *   if (!isAuthenticated) return <Text>Please sign in</Text>
 *
 *   return <Text>Hello {user?.name}</Text>
 * }
 * ```
 */
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
 *   if (userData === undefined) return <Text>Loading...</Text>
 *   if (userData === null) return <Text>Not authenticated</Text>
 *
 *   return <Text>Welcome {userData.name}</Text>
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
 *       Alert.alert('Please sign in')
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
 *     <Button
 *       disabled={!isAuthenticated}
 *       title={isAuthenticated ? 'Submit' : 'Sign in to submit'}
 *     />
 *   )
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuthState()
  return isAuthenticated
}

export { useLogout } from "./hooks/use-logout"
// Re-export auth action hooks
export { useSignIn } from "./hooks/use-sign-in"
export { useSignUp } from "./hooks/use-sign-up"
