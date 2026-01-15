import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * SnipVault Database Schema
 * 
 * Uses Convex Auth tables for authentication:
 * - users: User accounts
 * - sessions: Active sessions
 * - accounts: OAuth/credentials accounts
 * - authRefreshTokens: Token refresh tracking
 * - authSessions: Auth session management
 * - authVerificationCodes: Email/phone verification
 * - authVerifiers: Verification tracking
 * - authRateLimits: Rate limiting
 * 
 * Custom tables:
 * - snippets: Code/text snippet storage
 */
const schema = defineSchema({
  // Spread auth tables to include all authentication-related tables
  ...authTables,

  // Snippets table for storing code/text fragments
  snippets: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    category: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"]),
});

export default schema;
