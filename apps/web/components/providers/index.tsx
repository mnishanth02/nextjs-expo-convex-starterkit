"use client"

import { ConvexClientProvider } from "./convex-client-provider"
import { ThemeProvider } from "./theme-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ConvexClientProvider>
        {children}
        {/* <Toaster richColors /> */}
      </ConvexClientProvider>
    </ThemeProvider>
  )
}
