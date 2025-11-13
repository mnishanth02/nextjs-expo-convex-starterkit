/**
 * Auth error codes for standardized error handling
 * Used across web, native, and backend for consistent error reporting
 */
export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "USER_NOT_FOUND"
  | "EMAIL_ALREADY_EXISTS"
  | "EMAIL_NOT_VERIFIED"
  | "WEAK_PASSWORD"
  | "NETWORK_ERROR"
  | "SESSION_EXPIRED"
  | "UNAUTHORIZED"
  | "UNKNOWN_ERROR"

/**
 * Standardized auth error interface
 * Provides consistent error structure across all platforms
 */
export interface AuthError {
  /** Error code for programmatic error handling */
  code: AuthErrorCode
  /** User-friendly error message */
  message: string
  /** Original error object for debugging */
  originalError?: unknown
}
