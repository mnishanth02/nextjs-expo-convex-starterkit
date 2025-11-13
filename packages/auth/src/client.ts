import { convexClient } from "@convex-dev/better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

/**
 * Auth client for React applications
 * Provides client-side auth methods like signIn, signUp, signOut, etc.
 *
 * Use this in your React components to handle authentication
 *
 * @example
 * ```tsx
 * import { authClient } from "@repo/auth/client"
 *
 * function SignIn() {
 *   const handleSignIn = async () => {
 *     await authClient.signIn.email({
 *       email: "user@example.com",
 *       password: "password123"
 *     })
 *   }
 *   return <button onClick={handleSignIn}>Sign In</button>
 * }
 * ```
 */
export const authClient = createAuthClient({
  plugins: [convexClient()],
})
