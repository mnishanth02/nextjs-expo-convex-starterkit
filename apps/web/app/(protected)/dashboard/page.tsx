"use client"

import { Button } from "@repo/webui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/webui/components/card"
import { useLogout } from "@/lib/hooks/auth/use-logout"

const DashboardPage = () => {
  const { logout, isLoading } = useLogout()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Welcome to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={logout} disabled={isLoading} variant="destructive" className="w-full">
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
