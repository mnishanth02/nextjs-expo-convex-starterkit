import { useState } from "react"
import Toast from "react-native-toast-message"
import { authClient } from "../client"

/**
 * Hook for logging out the user
 * Navigation is handled automatically by Stack.Protected when auth state changes
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const { logout, isLoading } = useLogout()
 *
 *   return (
 *     <Button
 *       title="Logout"
 *       onPress={logout}
 *       disabled={isLoading}
 *     />
 *   )
 * }
 * ```
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    try {
      setIsLoading(true)

      await authClient.signOut()

      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      })

      // Auth state will change to isAuthenticated: false
      // Stack.Protected will automatically redirect to /(auth)/sign-in
    } catch {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { logout, isLoading }
}
