import { parseAuthError } from "@repo/utils/errors"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { authClient } from "../../auth/client"
import type { SignInInput } from "../../schemas/auth"

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signIn = async (data: SignInInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (result.error) {
        const errorMessage = parseAuthError(result.error)
        setError(errorMessage.message)
        return { success: false, error: errorMessage }
      }

      // Success - redirect to dashboard
      router.push("/dashboard")
      return { success: true }
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again."
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return { signIn, isLoading, error }
}
