/**
 * Auth state interface for components
 * Represents the current authentication status
 *
 * NOTE: User and Session types should be inferred from your auth client in each app:
 * - Web: `import type { User, Session } from "~/lib/auth/client"`
 * - Native: `import type { User, Session } from "~/lib/auth/client"`
 */
export interface AuthState<TUser = unknown, TSession = unknown> {
  /** Whether user is authenticated */
  isAuthenticated: boolean
  /** Whether auth state is being loaded */
  isLoading: boolean
  /** Current user object or null if not authenticated */
  user: TUser | null
  /** Current session object or null if not authenticated */
  session: TSession | null
  /** Any error that occurred during auth */
  error?: Error | null
}

/**
 * Sign-in credentials for email/password authentication
 */
export interface SignInCredentials {
  email: string
  password: string
  /** Remember user session across browser sessions */
  rememberMe?: boolean
}

/**
 * Sign-up data for new user registration
 */
export interface SignUpData {
  email: string
  password: string
  name: string
  /** Optional password confirmation field */
  confirmPassword?: string
}

/**
 * OAuth provider types supported by Better Auth
 */
export type OAuthProvider = "google" | "apple" | "github" | "facebook"

/**
 * OAuth sign-in options
 */
export interface OAuthSignInOptions {
  provider: OAuthProvider
  /** Redirect URL after successful authentication */
  callbackURL?: string
}

/**
 * Password reset request data
 */
export interface PasswordResetRequest {
  email: string
}

/**
 * Password reset confirmation data
 */
export interface PasswordResetConfirmation {
  token: string
  newPassword: string
  confirmPassword: string
}

/**
 * Email verification data
 */
export interface EmailVerificationData {
  token: string
}

/**
 * User profile update data
 */
export interface UserProfileUpdate {
  name?: string
  image?: string
  /** Additional user metadata */
  metadata?: Record<string, unknown>
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
