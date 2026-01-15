"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Trash2, Calendar, Edit2, Play, CornerDownRight } from "lucide-react";

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
 * SnippetCard Component - Swiss International Style
 * 
 * Features:
 * - Rectangular card with thick borders
 * - Interactions: Full color inversion on hover
 * - Typography: Bold, Uppercase labels
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
            toast.success("Copied to clipboard!", { className: "rounded-none border-2 border-black" });
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setIsDeleting(true);
        try {
            await deleteSnippet({ id });
            toast.success("Snippet deleted");
        } catch (error) {
            toast.error("Failed to delete snippet");
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

    const previewContent = content.split("\n").slice(0, 6).join("\n");

    return (
        <div className="group relative bg-card text-card-foreground border-2 border-border transition-all duration-300 hover:border-accent hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 flex flex-col h-full">
            {/* Header Area */}
            <div className="p-6 pb-2 flex justify-between items-start border-b-2 border-border/10 group-hover:border-accent/20 transition-colors duration-300">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 bg-foreground transition-all duration-300 group-hover:bg-accent group-hover:rotate-90"></span>
                        <h3 className="font-black text-xl uppercase tracking-tight leading-none text-card-foreground transition-colors duration-300 group-hover:text-accent">
                            {title}
                        </h3>
                    </div>
                </div>
                {category && (
                    <Badge variant="outline" className="border-border text-card-foreground rounded-none text-xs font-bold uppercase transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                        {category}
                    </Badge>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6 pt-4 flex-grow font-mono text-xs overflow-hidden relative bg-card">
                <pre className="opacity-100 transition-opacity duration-300 whitespace-pre-wrap break-words text-card-foreground/90">
                    {previewContent}
                </pre>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent"></div>
            </div>

            {/* Footer / Actions */}
            <div className="p-4 border-t-2 border-border transition-colors duration-300 group-hover:border-accent flex items-center justify-between bg-muted group-hover:bg-accent/5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors duration-300 group-hover:text-accent">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(id)}
                            className="h-8 w-8 p-0 rounded-none text-muted-foreground hover:bg-foreground hover:text-background group-hover:text-foreground group-hover:hover:bg-accent group-hover:hover:text-white transition-colors"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 rounded-none text-muted-foreground hover:bg-destructive hover:text-white hover:border-destructive group-hover:text-destructive transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleCopy}
                        className={`h-8 px-4 rounded-none font-bold uppercase text-xs transition-all duration-300 border-2 ${isCopied
                            ? "bg-accent text-white border-accent"
                            : "bg-primary text-primary-foreground border-primary hover:bg-background hover:text-foreground hover:border-accent group-hover:border-accent group-hover:bg-background group-hover:text-accent group-hover:hover:bg-accent group-hover:hover:text-white"
                            }`}
                    >
                        {isCopied ? (
                            <Check className="h-3.5 w-3.5 mr-1" />
                        ) : (
                            <Copy className="h-3.5 w-3.5 mr-1" />
                        )}
                        {isCopied ? "Copied" : "Copy"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
