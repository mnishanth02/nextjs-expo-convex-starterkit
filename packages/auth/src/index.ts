/**
 * @repo/auth - Shared authentication utilities for Better Auth + Convex
 *
 * This package provides reusable authentication utilities that work across
 * both Next.js (web) and Expo (React Native) applications.
 */

// Core auth client
export { authClient } from "./client"
// Error handling
export {
  type AuthError,
  type AuthErrorCode,
  getAuthErrorMessage,
  isAuthError,
  parseAuthError,
} from "./errors"
// Auth hooks
export { useAuthenticatedQuery, useAuthState, useIsAuthenticated, useUserId } from "./hooks"

// TypeScript types
export type {
  AuthState,
  ChangePasswordData,
  EmailVerificationData,
  OAuthProvider,
  OAuthSignInOptions,
  PasswordResetConfirmation,
  PasswordResetRequest,
  Session,
  SignInCredentials,
  SignUpData,
  User,
  UserProfileUpdate,
} from "./types"
