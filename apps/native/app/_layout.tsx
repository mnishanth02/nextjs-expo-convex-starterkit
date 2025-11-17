import "../global.css"
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import Toast from "react-native-toast-message"
import "react-native-reanimated"

import { AuthLoading } from "@/components/auth"
import { ConvexClientProvider } from "@/components/providers/convex-client-provider"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { useAuthState } from "@/lib/auth/hooks"

export const unstable_settings = {
  // This is intentionally commented out to avoid auto-redirects
  // anchor: "(tabs)",
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuthState()
  const colorScheme = useColorScheme()

  // Show loading screen while checking authentication
  if (isLoading) {
    return <AuthLoading />
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Protected routes - only accessible when authenticated */}
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        </Stack.Protected>

        {/* Public routes - only accessible when NOT authenticated */}
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        {/* Index route - handles initial redirect */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <ConvexClientProvider>
      <RootNavigator />
    </ConvexClientProvider>
  )
}
