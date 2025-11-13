"use client"

import { api } from "@repo/backend/convex/_generated/api"
import { Button } from "@repo/webui/components/button"
import { useQuery } from "convex/react"

const TITLE_TEXT = `Starter Kit: Next.js App Router + TypeScript + Tailwind CSS + Convex
 `

export default function Home() {
  const healthCheck = useQuery(api.healthCheck.get)

  return (
    <div className="container mx-auto flex h-screen max-w-3xl flex-col items-center justify-center px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck === "OK" ? "bg-green-500" : healthCheck === undefined ? "bg-orange-400" : "bg-red-500"}`}
            />
            <span className="text-muted-foreground text-sm">
              {healthCheck === undefined
                ? "Checking..."
                : healthCheck === "OK"
                  ? "Connected"
                  : "Error"}
            </span>
          </div>
          <Button variant="destructive" className="mt-4">
            Refresh Status
          </Button>
        </section>
      </div>
    </div>
  )
}
