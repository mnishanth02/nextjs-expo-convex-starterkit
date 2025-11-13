import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { betterAuth } from "better-auth"
import { components } from "./_generated/api"
import type { DataModel } from "./_generated/dataModel"
import { query } from "./_generated/server"

const siteUrl = process.env.SITE_URL!

/**
 * Auth component client - provides helper methods for interacting with Better Auth in Convex
 * Use this in your Convex functions to access auth functionality
 */
export const authComponent = createClient<DataModel>(components.betterAuth)

/**
 * Creates a Better Auth instance configured for Convex
 * This is called internally by the framework to handle auth requests
 *
 * @param ctx - Convex context
 * @param optionsOnly - If true, disables logging (used when generating options)
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    // Disable logging when createAuth is called just to generate options
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),

    trustedOrigins:
      process.env.NODE_ENV === "production"
        ? [process.env.SITE_URL!, process.env.SITE_URL1!].filter((url): url is string =>
            Boolean(url)
          )
        : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID!,
        clientSecret: process.env.APPLE_CLIENT_SECRET!,
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})

/**
 * Export type for use in other packages
 */
export type { GenericCtx }
