/**
 * Expo App Auth Module
 *
 * Expo-specific authentication setup using Better Auth + Convex
 *
 * @see https://convex-better-auth.netlify.app/framework-guides/expo
 */

export type { Session, User } from "./client"
export { authClient } from "./client"
export { useAuthenticatedQuery, useAuthState, useIsAuthenticated, useUserId } from "./hooks"
