"use client";

import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { SnippetCard } from "@/components/snippet-card";
import { CreateSnippetDialog } from "@/components/create-snippet-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Code2,
    LogOut,
    Loader2,
    Sparkles,
    Zap,
    Filter,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { signOut } = useAuthActions();
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const snippets = useQuery(api.snippets.list, {
        category: selectedCategory === "all" ? undefined : selectedCategory
    });

    const categories = useQuery(api.snippets.getCategories, {});

    const isLoading = snippets === undefined;

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Swiss Header */}
            <header className="sticky top-0 z-50 bg-background border-b-4 border-black">
                <div className="flex justify-between items-stretch h-16">
                    <div className="flex items-center px-6 border-r-4 border-black bg-accent text-white">
                        <Code2 className="h-6 w-6" />
                    </div>
                    <div className="flex-1 flex items-center px-6">
                        <span className="font-black text-xl uppercase tracking-tighter">SnipVault<span className="text-accent">.</span></span>
                        <div className="hidden md:flex items-center ml-4 gap-2 px-3 py-1 bg-muted border border-black/10">
                            <Zap className="h-3 w-3 text-accent" />
                            <span className="text-xs font-bold uppercase tracking-wide">System Connected</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-6 border-l-4 border-black bg-white">
                        <CreateSnippetDialog />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            className="h-10 hover:bg-destructive hover:text-white rounded-none uppercase font-bold text-xs"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 lg:p-12">
                {/* Controls Area */}
                <div className="mb-12 border-4 border-black p-6 bg-muted swiss-dots">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black text-white">
                                <Filter className="h-4 w-4" />
                            </div>
                            <span className="font-bold uppercase tracking-wide text-sm">Category Index</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedCategory === "all" ? "default" : "outline"}
                                onClick={() => setSelectedCategory("all")}
                                className={`h-8 font-bold uppercase text-xs ${selectedCategory === "all" ? "bg-black text-white border-black" : "bg-white text-black border-2 border-black hover:bg-black hover:text-white"}`}
                            >
                                All
                            </Button>
                            {categories?.map((cat) => (
                                <Button
                                    key={cat}
                                    variant={selectedCategory === cat ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`h-8 font-bold uppercase text-xs ${selectedCategory === cat ? "bg-black text-white border-black" : "bg-white text-black border-2 border-black hover:bg-black hover:text-white"}`}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Line */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="px-3 py-1 border-2 border-black bg-white font-mono text-xs font-bold">
                        TOTAL_ENTRIES: {isLoading ? "..." : snippets.length}
                    </div>
                    {selectedCategory !== "all" && (
                        <div className="px-3 py-1 border-2 border-black bg-accent text-white font-mono text-xs font-bold">
                            FILTER: {selectedCategory.toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 border-4 border-black border-dashed opacity-50">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <span className="font-bold uppercase tracking-widest">Retrieving Data...</span>
                    </div>
                ) : snippets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 border-4 border-black bg-white swiss-grid-pattern">
                        <div className="w-24 h-24 bg-black text-white flex items-center justify-center mb-6">
                            <Sparkles className="h-10 w-10" />
                        </div>
                        <h3 className="text-3xl font-black uppercase mb-4">Vault Empty</h3>
                        <p className="text-muted-foreground font-medium max-w-md text-center mb-8">
                            {selectedCategory === "all"
                                ? "Initialize your database by creating a new snippet."
                                : "No entries found in this sector."}
                        </p>
                        <CreateSnippetDialog>
                            <Button size="lg" className="h-14 px-8 font-black uppercase text-lg border-2 border-transparent bg-accent text-white hover:bg-black">
                                Create Entry +
                            </Button>
                        </CreateSnippetDialog>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            </main>
        </div>
    );
}
