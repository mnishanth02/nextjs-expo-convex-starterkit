import { Redirect } from "expo-router"
import { useAuthState } from "@/lib/auth/hooks"

/**
 * Root index route - handles initial navigation based on auth state
 * This route immediately redirects to either the authenticated tabs or sign-in
 */
export default function Index() {
  const { isAuthenticated, isLoading } = useAuthState()

  // Don't render anything while loading - the loading state is handled in _layout.tsx
  if (isLoading) {
    return null
  }

  // Redirect to authenticated area if logged in
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />
  }

  // Redirect to sign-in if not authenticated
  return <Redirect href="/(auth)/sign-in" />
}
