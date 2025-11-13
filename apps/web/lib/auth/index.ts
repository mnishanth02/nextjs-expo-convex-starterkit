/**
 * Web App Auth Module
 *
 * Next.js-specific authentication setup using Better Auth + Convex
 *
 * @see https://convex-better-auth.netlify.app/framework-guides/next
 */

export type { Session, User } from "./client"
export { authClient } from "./client"
export { useAuthenticatedQuery, useAuthState, useIsAuthenticated, useUserId } from "./hooks"
