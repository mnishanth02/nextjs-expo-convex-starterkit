import Constants from "expo-constants"
import { useState } from "react"
import Toast from "react-native-toast-message"
import { authClient } from "../client"

/**
 * Hook for Google OAuth sign-in
 * Uses Better Auth's social sign-in with Google provider
 *
 * @example
 * ```tsx
 * function GoogleSignInButton() {
 *   const { signInWithGoogle, isLoading } = useGoogleSignIn()
 *
 *   return (
 *     <Button
 *       title="Sign in with Google"
 *       onPress={signInWithGoogle}
 *       disabled={isLoading}
 *     />
 *   )
 * }
 * ```
 */
export function useGoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signInWithGoogle = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Use the app scheme for deep linking back to the app
      const scheme = Constants.expoConfig?.scheme || "native"
      const callbackURL = `${scheme}://(tabs)`

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL, // Full deep link URL for redirect after OAuth
      })

      if (result?.error) {
        const errorMessage = result.error.message || "Failed to sign in with Google"
        setError(errorMessage)
        Toast.show({
          type: "error",
          text1: "Google Sign-In Failed",
          text2: errorMessage,
        })
        return { success: false, error: errorMessage }
      }

      // Success - show success message
      Toast.show({
        type: "success",
        text1: "Welcome!",
        text2: "You've successfully signed in with Google",
      })

      // Navigation will be handled by the Better Auth redirect
      return { success: true }
    } catch {
      const errorMessage = "An unexpected error occurred during Google sign-in"
      setError(errorMessage)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return { signInWithGoogle, isLoading, error }
}
