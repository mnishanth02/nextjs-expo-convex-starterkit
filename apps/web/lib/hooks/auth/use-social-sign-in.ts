import { useState } from "react"
import { authClient } from "../../auth/client"

type SocialProvider = "google" | "apple"

export function useSocialSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signInWithSocial = async (provider: SocialProvider) => {
    setIsLoading(true)
    setError(null)

    try {
      // Use relative URL for callback - Better Auth will construct full URL using baseURL
      // This ensures proper OAuth state parameter validation across domains
      const callbackURL = "/dashboard"

      const result = await authClient.signIn.social({
        provider,
        callbackURL,
      })

      if (result.error) {
        setError(result.error.message || "Failed to sign in with social provider")
        return { success: false, error: result.error.message }
      }

      // OAuth will redirect automatically, no need to manually navigate
      return { success: true }
    } catch {
      const errorMessage = "An unexpected error occurred during sign in"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return { signInWithSocial, isLoading, error }
}
