import { Redirect } from "expo-router"
import { useAuthState } from "@/lib/auth/hooks"

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthState()

  // Show nothing while checking auth
  if (isLoading) {
    return null
  }

  // Redirect based on auth state
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />
  }

  return <Redirect href="/(auth)/sign-in" />
}
