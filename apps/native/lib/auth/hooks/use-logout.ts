import { useRouter } from "expo-router"
import { useState } from "react"
import Toast from "react-native-toast-message"
import { authClient } from "../client"

/**
 * Hook for logging out the user
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
  const router = useRouter()

  const logout = async () => {
    try {
      setIsLoading(true)

      await authClient.signOut()

      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      })

      // Navigate to sign-in screen
      // biome-ignore lint/suspicious/noExplicitAny: Typed routes will be generated on app start
      router.replace("/(auth)/sign-in" as any)
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
