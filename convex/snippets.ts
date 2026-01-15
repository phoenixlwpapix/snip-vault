import { v } from "convex/values";
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Get the current user's ID from the authentication context.
 * Uses Convex Auth's getAuthUserId which returns the actual user document ID.
 * Throws an error if the user is not authenticated.
 */
async function getAuthenticatedUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
        throw new Error("Not authenticated. Please sign in to continue.");
    }
    return userId;
}

/**
 * List all snippets for the authenticated user.
 * 
 * Uses the by_user index for efficient querying.
 * Optionally filters by category if provided.
 * 
 * ⚡ REAL-TIME: This query will automatically update when snippets change.
 */
export const list = query({
    args: {
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthenticatedUserId(ctx);

        let snippetsQuery = ctx.db
            .query("snippets")
            .withIndex("by_user", (q) => q.eq("userId", userId));

        const snippets = await snippetsQuery.collect();

        // Filter by category if provided (post-query filter for flexibility)
        if (args.category && args.category !== "all") {
            return snippets.filter((snippet) => snippet.category === args.category);
        }

        // Sort by most recent first
        return snippets.sort((a, b) => b.createdAt - a.createdAt);
    },
});

/**
 * Get a single snippet by ID.
 * Ensures the snippet belongs to the authenticated user.
 */
export const get = query({
    args: {
        id: v.id("snippets"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthenticatedUserId(ctx);
        const snippet = await ctx.db.get(args.id);

        if (!snippet) {
            return null;
        }

        // Ensure the user owns this snippet
        if (snippet.userId !== userId) {
            throw new Error("Access denied. This snippet does not belong to you.");
        }

        return snippet;
    },
});

/**
 * Create a new snippet for the authenticated user.
 * 
 * Automatically attaches the current user's ID and timestamps.
 */
export const create = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        category: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthenticatedUserId(ctx);
        const now = Date.now();

        const snippetId = await ctx.db.insert("snippets", {
            userId,
            title: args.title,
            content: args.content,
            category: args.category || "General",
            isPublic: args.isPublic || false,
            createdAt: now,
            updatedAt: now,
        });

        return snippetId;
    },
});

/**
 * Update an existing snippet.
 * Ensures the snippet belongs to the authenticated user.
 */
export const update = mutation({
    args: {
        id: v.id("snippets"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        category: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthenticatedUserId(ctx);
        const snippet = await ctx.db.get(args.id);

        if (!snippet) {
            throw new Error("Snippet not found.");
        }

        // Ensure the user owns this snippet
        if (snippet.userId !== userId) {
            throw new Error("Access denied. This snippet does not belong to you.");
        }

        // Build update object with only provided fields
        const updates: Partial<typeof snippet> = {
            updatedAt: Date.now(),
        };

        if (args.title !== undefined) updates.title = args.title;
        if (args.content !== undefined) updates.content = args.content;
        if (args.category !== undefined) updates.category = args.category;
        if (args.isPublic !== undefined) updates.isPublic = args.isPublic;

        await ctx.db.patch(args.id, updates);

        return args.id;
    },
});

/**
 * Delete a snippet.
 * Ensures the snippet belongs to the authenticated user before deletion.
 */
export const remove = mutation({
    args: {
        id: v.id("snippets"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthenticatedUserId(ctx);
        const snippet = await ctx.db.get(args.id);

        if (!snippet) {
            throw new Error("Snippet not found.");
        }

        // Ensure the user owns this snippet
        if (snippet.userId !== userId) {
            throw new Error("Access denied. This snippet does not belong to you.");
        }

        await ctx.db.delete(args.id);

        return args.id;
    },
});

/**
 * Get all unique categories for the authenticated user.
 * Useful for filtering UI.
 */
export const getCategories = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthenticatedUserId(ctx);

        const snippets = await ctx.db
            .query("snippets")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const categories = new Set<string>();
        snippets.forEach((snippet) => {
            if (snippet.category) {
                categories.add(snippet.category);
            }
        });

        return Array.from(categories).sort();
    },
});
