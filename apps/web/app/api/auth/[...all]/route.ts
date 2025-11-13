import { nextJsHandler } from "@convex-dev/better-auth/nextjs"

/**
 * Better Auth API route handler for Next.js
 * Proxies auth requests from the Next.js app to the Convex deployment
 *
 * This handles all auth endpoints like:
 * - /api/auth/sign-in
 * - /api/auth/sign-up
 * - /api/auth/sign-out
 * - etc.
 */
export const { GET, POST } = nextJsHandler()
