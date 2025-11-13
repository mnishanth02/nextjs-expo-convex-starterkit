import type { AuthError, AuthErrorCode } from "@repo/types/errors"

/**
 * Parse Better Auth errors into user-friendly messages
 * Works across both web and native platforms
 *
 * @param error - The error from Better Auth or network request
 * @returns Standardized auth error with user-friendly message
 *
 * @example
 * ```tsx
 * import { parseAuthError } from "@repo/utils/errors"
 *
 * async function handleSignIn(email: string, password: string) {
 *   try {
 *     await authClient.signIn.email({ email, password })
 *   } catch (error) {
 *     const authError = parseAuthError(error)
 *     toast.error(authError.message)
 *   }
 * }
 * ```
 */
export function parseAuthError(error: unknown): AuthError {
  if (!error) {
    return {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred",
    }
  }

  // Handle Better Auth specific errors
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as { error: unknown }).error === "object" &&
    (error as { error: unknown }).error !== null &&
    "message" in ((error as { error: unknown }).error as object)
  ) {
    const errorMessage = String(
      ((error as { error: { message: unknown } }).error.message as string) || ""
    ).toLowerCase()

    // Invalid credentials
    if (errorMessage.includes("invalid") && errorMessage.includes("credential")) {
      return {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password. Please try again.",
        originalError: error,
      }
    }

    // Email already exists
    if (errorMessage.includes("already exists") || errorMessage.includes("duplicate")) {
      return {
        code: "EMAIL_ALREADY_EXISTS",
        message: "An account with this email already exists.",
        originalError: error,
      }
    }

    // User not found
    if (errorMessage.includes("not found") || errorMessage.includes("no user")) {
      return {
        code: "USER_NOT_FOUND",
        message: "User not found. Please check your email.",
        originalError: error,
      }
    }

    // Email not verified
    if (errorMessage.includes("not verified") || errorMessage.includes("verify")) {
      return {
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before signing in.",
        originalError: error,
      }
    }

    // Weak password
    if (errorMessage.includes("password") && errorMessage.includes("weak")) {
      return {
        code: "WEAK_PASSWORD",
        message: "Password is too weak. Please choose a stronger password.",
        originalError: error,
      }
    }

    // Session expired
    if (errorMessage.includes("expired") || errorMessage.includes("session")) {
      return {
        code: "SESSION_EXPIRED",
        message: "Your session has expired. Please sign in again.",
        originalError: error,
      }
    }

    // Unauthorized
    if (errorMessage.includes("unauthorized") || errorMessage.includes("forbidden")) {
      return {
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action.",
        originalError: error,
      }
    }
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      code: "NETWORK_ERROR",
      message: "Network error. Please check your internet connection and try again.",
      originalError: error,
    }
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message || "An unexpected error occurred. Please try again.",
      originalError: error,
    }
  }

  // Fallback for unknown error types
  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred. Please try again.",
    originalError: error,
  }
}

/**
 * Get a user-friendly error message from an auth error
 * Convenience function when you only need the message
 *
 * @example
 * ```tsx
 * try {
 *   await authClient.signIn.email({ email, password })
 * } catch (error) {
 *   alert(getAuthErrorMessage(error))
 * }
 * ```
 */
export function getAuthErrorMessage(error: unknown): string {
  return parseAuthError(error).message
}

/**
 * Check if an error is a specific auth error code
 *
 * @example
 * ```tsx
 * try {
 *   await authClient.signIn.email({ email, password })
 * } catch (error) {
 *   if (isAuthError(error, 'INVALID_CREDENTIALS')) {
 *     // Handle invalid credentials specifically
 *   }
 * }
 * ```
 */
export function isAuthError(error: unknown, code: AuthErrorCode): boolean {
  return parseAuthError(error).code === code
}
