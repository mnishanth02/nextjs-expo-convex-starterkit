/**
 * @repo/types
 *
 * Shared TypeScript types for the monorepo.
 * Framework-agnostic, zero runtime dependencies.
 */

// Auth types
export type {
  AuthState,
  ChangePasswordData,
  EmailVerificationData,
  OAuthProvider,
  OAuthSignInOptions,
  PasswordResetConfirmation,
  PasswordResetRequest,
  SignInCredentials,
  SignUpData,
  UserProfileUpdate,
} from "./auth"

// Error types
export type { AuthError, AuthErrorCode } from "./errors"
