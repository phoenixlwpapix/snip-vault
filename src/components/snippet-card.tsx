"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Trash2, Calendar, Edit2 } from "lucide-react";

interface SnippetCardProps {
    id: Id<"snippets">;
    title: string;
    content: string;
    category?: string;
    createdAt: number;
    updatedAt: number;
    onEdit?: (id: Id<"snippets">) => void;
}

/**
 * SnippetCard Component
 * 
 * Displays a single code snippet with:
 * - Title and category badge
 * - Code preview with syntax styling
 * - Copy to clipboard functionality with toast feedback
 * - Delete with confirmation
 * - Timestamps
 * 
 * ⚡ REAL-TIME: Deletions will instantly reflect across all connected clients
 */
export function SnippetCard({
    id,
    title,
    content,
    category,
    createdAt,
    onEdit,
}: SnippetCardProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteSnippet = useMutation(api.snippets.remove);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setIsCopied(true);
            toast.success("Copied to clipboard!", {
                description: `"${title}" is ready to paste`,
                duration: 2000,
            });

            // Reset copy button after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy", {
                description: "Please try selecting and copying manually",
            });
        }
    };

    const handleDelete = async () => {
        // Simple confirmation
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteSnippet({ id });
            toast.success("Snippet deleted", {
                description: `"${title}" has been removed`,
            });
        } catch (error) {
            toast.error("Failed to delete snippet", {
                description: "Please try again",
            });
            setIsDeleting(false);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(timestamp));
    };

    // Truncate content for preview (first 8 lines)
    const previewContent = content.split("\n").slice(0, 8).join("\n");
    const hasMoreContent = content.split("\n").length > 8;

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 animate-slide-up">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-snip-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <CardHeader className="pb-3 relative">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="font-semibold text-lg leading-tight truncate">
                            {title}
                        </h3>
                        {category && (
                            <Badge
                                variant="secondary"
                                className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                            >
                                {category}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-4 relative">
                <div className="relative">
                    <pre className="code-block text-xs leading-relaxed whitespace-pre-wrap break-words max-h-48 overflow-hidden">
                        <code>{previewContent}</code>
                    </pre>
                    {hasMoreContent && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-muted/80 to-transparent flex items-end justify-center pb-1">
                            <span className="text-xs text-muted-foreground">
                                ... more content
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 flex items-center justify-between gap-2 relative">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(createdAt)}</span>
                </div>

                <div className="flex items-center gap-1">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(id)}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleCopy}
                        className={`h-8 gap-1.5 transition-all duration-200 ${isCopied
                                ? "bg-snip-accent hover:bg-snip-accent text-white"
                                : ""
                            }`}
                    >
                        {isCopied ? (
                            <>
                                <Check className="h-3.5 w-3.5" />
                                <span className="text-xs">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3.5 w-3.5" />
                                <span className="text-xs">Copy</span>
                            </>
                        )}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
