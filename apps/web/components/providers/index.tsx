"use client"

import { ThemeProvider } from "./theme-provider"

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      {/* <Toaster richColors /> */}
    </ThemeProvider>
  )
}
