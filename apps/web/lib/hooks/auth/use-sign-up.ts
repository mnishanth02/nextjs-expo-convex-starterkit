import { authClient } from "@repo/auth/client"
import { parseAuthError } from "@repo/auth/errors"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { SignUpInput } from "../../schemas/auth"

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

  return { signUp, isLoading, error }
}
