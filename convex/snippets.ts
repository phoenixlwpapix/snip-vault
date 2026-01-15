import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

/**
 * Get the current user's ID from the authentication context.
 * Throws an error if the user is not authenticated.
 */
async function getAuthenticatedUserId(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Not authenticated. Please sign in to continue.");
    }
    // The subject is the user ID
    const userId = identity.subject;
    return userId as unknown as import("./_generated/dataModel").Id<"users">;
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
