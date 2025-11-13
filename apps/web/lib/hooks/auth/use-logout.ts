import { authClient } from "@repo/auth/client"
import { useState } from "react"

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)

    try {
      await authClient.signOut()

      // Force a full page reload to clear all auth state
      window.location.href = "/sign-in"
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if logout fails, redirect to sign-in to clear state
      window.location.href = "/sign-in"
    } finally {
      setIsLoading(false)
    }
  }

  return { logout, isLoading }
}
