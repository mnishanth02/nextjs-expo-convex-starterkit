import { expo } from "@better-auth/expo"
import { createClient, type GenericCtx } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { betterAuth } from "better-auth"
import { components } from "./_generated/api"
import type { DataModel } from "./_generated/dataModel"
import { query } from "./_generated/server"

const siteUrl = process.env.SITE_URL as string

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
      level: "debug",
    },
    baseURL: siteUrl,
    trustedOrigins: [
      "native://", // Production Expo app scheme
      "exp://", // Expo Go development
      "http://localhost:8081", // Expo Metro bundler
    ],
    secret: process.env.BETTER_AUTH_SECRET as string,
    database: authComponent.adapter(ctx),

    account: {
      accountLinking: {
        enabled: true,
        allowDifferentEmails: true,
      },
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: "offline",
        prompt: "select_account consent",
      },
      // apple: {
      //   clientId: process.env.APPLE_CLIENT_ID || "",
      //   clientSecret: process.env.APPLE_CLIENT_SECRET || "",
      // },
    },
    // The Expo and Convex plugins are required for this setup
    plugins: [expo(), convex()],
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await authComponent.getAuthUser(ctx)
    } catch {
      return null
    }
  },
})

/**
 * Export type for use in other packages
 */
export type { GenericCtx }
