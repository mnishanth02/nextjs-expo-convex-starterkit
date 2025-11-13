import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import Toast from "react-native-toast-message"
import "react-native-reanimated"

import { ConvexClientProvider } from "@/components/providers/convex-client-provider"
import { useColorScheme } from "@/hooks/use-color-scheme"

export const unstable_settings = {
  // This is intentionally commented out to avoid auto-redirects
  // anchor: "(tabs)",
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ConvexClientProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        </Stack>
        <StatusBar style="auto" />
        <Toast />
      </ThemeProvider>
    </ConvexClientProvider>
  )
}
