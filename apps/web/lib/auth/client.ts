import { convexClient } from "@convex-dev/better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

/**
 * Better Auth client for Next.js web app
 * Configured with Convex plugin for authentication
 *
 * @see https://convex-better-auth.netlify.app/framework-guides/next
 */
export const authClient = createAuthClient({
  plugins: [convexClient()],
})

/**
 * Infer user type from Better Auth client
 * Use this type throughout your web app for type safety
 */
export type User = NonNullable<Awaited<ReturnType<typeof authClient.getSession>>>["user"]

/**
 * Infer session type from Better Auth client
 * Use this type throughout your web app for type safety
 */
export type Session = NonNullable<Awaited<ReturnType<typeof authClient.getSession>>>["session"]
