import { parseAuthError } from "@repo/utils/errors"
import { useRouter } from "expo-router"
import { useState } from "react"
import Toast from "react-native-toast-message"
import type { SignUpInput } from "../../schemas/auth"
import { authClient } from "../client"

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signUp = async (data: SignUpInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (result.error) {
        const errorMessage = parseAuthError(result.error)
        setError(errorMessage.message)
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: errorMessage.message,
        })
        return { success: false, error: errorMessage }
      }

      // Success - redirect to home tab
      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2: "Welcome aboard!",
      })
      router.replace("/(tabs)")
      return { success: true }
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again"
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

  return { signUp, isLoading, error }
}
