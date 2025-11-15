"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription } from "@repo/webui/components/alert"
import { Button } from "@repo/webui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/webui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/webui/components/field"
import { Input } from "@repo/webui/components/input"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { useSignUp } from "@/lib/hooks/auth/use-sign-up"
import { type SignUpInput, signUpSchema } from "@/lib/schemas/auth"

export default function SignUpPage() {
  const { signUp, isLoading, error: authError } = useSignUp()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignUpInput) => {
    await signUp(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
            {authError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      We'll never share your email with anyone else.
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Must be at least 8 characters with uppercase, lowercase, and numbers.
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-confirm-password">Confirm Password</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" form="sign-up-form" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <GoogleSignInButton className="w-full" />

          <p className="text-center text-muted-foreground text-sm">
            {"Already have an account? "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
