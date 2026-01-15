"use client";

import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { SnippetCard } from "@/components/snippet-card";
import { CreateSnippetDialog } from "@/components/create-snippet-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Code2,
    LogOut,
    Loader2,
    FolderOpen,
    Sparkles,
    Zap,
    Filter,
} from "lucide-react";

/**
 * Dashboard Page
 * 
 * Main application interface for managing code snippets.
 * 
 * ⚡ REAL-TIME SYNC: This page uses useQuery(api.snippets.list) which
 * automatically subscribes to changes. When a snippet is created, updated,
 * or deleted (even from another device), the UI updates INSTANTLY with
 * NO manual refresh or revalidation needed. This is the power of Convex!
 */
export default function DashboardPage() {
    const { signOut } = useAuthActions();
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // ⚡ REAL-TIME QUERY: Automatically updates when data changes!
    const snippets = useQuery(api.snippets.list, {
        category: selectedCategory === "all" ? undefined : selectedCategory
    });

    const categories = useQuery(api.snippets.getCategories, {});

    const isLoading = snippets === undefined;

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Code2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl gradient-text">SnipVault</h1>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Zap className="h-3 w-3 text-snip-accent" />
                                <span>Real-time sync enabled</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <CreateSnippetDialog />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Category Filters */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Filter by category
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCategory === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory("all")}
                            className="text-xs"
                        >
                            All Snippets
                        </Button>

                        {categories?.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                                className="text-xs"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Stats */}
                <div className="flex items-center gap-4 mb-8">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                        <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                        {isLoading ? "..." : snippets.length} snippets
                    </Badge>

                    {selectedCategory !== "all" && (
                        <Badge variant="outline" className="text-sm px-3 py-1">
                            Filtered: {selectedCategory}
                        </Badge>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p className="text-sm">Loading your snippets...</p>
                    </div>
                ) : snippets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                            <Sparkles className="h-10 w-10 text-primary/40" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {selectedCategory === "all"
                                ? "No snippets yet"
                                : `No ${selectedCategory} snippets`}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            {selectedCategory === "all"
                                ? "Create your first snippet to start building your personal code vault."
                                : "No snippets found in this category. Create one or select a different filter."}
                        </p>
                        <CreateSnippetDialog>
                            <Button size="lg" className="gap-2 font-semibold">
                                <Sparkles className="h-4 w-4" />
                                Create your first snippet
                            </Button>
                        </CreateSnippetDialog>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {snippets.map((snippet) => (
                            <SnippetCard
                                key={snippet._id}
                                id={snippet._id}
                                title={snippet.title}
                                content={snippet.content}
                                category={snippet.category}
                                createdAt={snippet.createdAt}
                                updatedAt={snippet.updatedAt}
                            />
                        ))}
                    </div>
                )}

                {/* Real-time notice */}
                <div className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Zap className="h-3.5 w-3.5 text-snip-accent" />
                    <span>
                        Changes sync in real-time across all your devices — powered by Convex
                    </span>
                </div>
            </main>
        </div>
    );
}
