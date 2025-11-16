import { GluestackUIProvider } from "@gluestack-ui/themed"
import type { ReactNode } from "react"
import { useColorScheme } from "@/hooks/use-color-scheme"

interface GluestackProviderProps {
  children: ReactNode
}

export function GluestackProvider({ children }: GluestackProviderProps) {
  const colorScheme = useColorScheme()

  return <GluestackUIProvider colorMode={colorScheme ?? "light"}>{children}</GluestackUIProvider>
}
