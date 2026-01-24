"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Copy,
    Check,
    Edit2,
    Save,
    X,
    Calendar,
    Clock,
    Code2,
    Sparkles,
} from "lucide-react";

interface SnippetData {
    id: Id<"snippets">;
    title: string;
    content: string;
    category?: string;
    createdAt: number;
    updatedAt: number;
}

interface SnippetPreviewModalProps {
    snippet: SnippetData | null;
    isOpen: boolean;
    onClose: () => void;
}

export function SnippetPreviewModal({
    snippet,
    isOpen,
    onClose,
}: SnippetPreviewModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Edit form state
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editCategory, setEditCategory] = useState("");

    const updateSnippet = useMutation(api.snippets.update);

    // Reset form when snippet changes or modal opens
    useEffect(() => {
        if (snippet) {
            setEditTitle(snippet.title);
            setEditContent(snippet.content);
            setEditCategory(snippet.category || "");
        }
        setIsEditing(false);
    }, [snippet, isOpen]);

    const handleCopy = async () => {
        if (!snippet) return;
        try {
            await navigator.clipboard.writeText(snippet.content);
            setIsCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    const handleSave = async () => {
        if (!snippet) return;
        setIsSaving(true);
        try {
            await updateSnippet({
                id: snippet.id,
                title: editTitle,
                content: editContent,
                category: editCategory || undefined,
            });
            toast.success("Snippet updated!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update snippet");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (snippet) {
            setEditTitle(snippet.title);
            setEditContent(snippet.content);
            setEditCategory(snippet.category || "");
        }
        setIsEditing(false);
    };

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(timestamp));
    };

    if (!snippet) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-4 border-black rounded-none bg-background">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b-4 border-black bg-muted">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {isEditing ? (
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="text-2xl font-black uppercase tracking-tight border-2 border-black rounded-none h-12 bg-white"
                                    placeholder="Snippet title"
                                />
                            ) : (
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-4 h-4 bg-accent animate-pulse" />
                                    {snippet.title}
                                </DialogTitle>
                            )}
                        </div>
                        {isEditing ? (
                            <Input
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-32 text-xs font-bold uppercase border-2 border-black rounded-none h-8 bg-white"
                                placeholder="Category"
                            />
                        ) : (
                            snippet.category && (
                                <Badge
                                    variant="outline"
                                    className="border-2 border-black rounded-none text-xs font-bold uppercase px-3 py-1"
                                >
                                    {snippet.category}
                                </Badge>
                            )
                        )}
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Created: {formatDate(snippet.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated: {formatDate(snippet.updatedAt)}</span>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-6 bg-card">
                    {isEditing ? (
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wide">
                                Content
                            </Label>
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="min-h-[300px] font-mono text-sm border-2 border-black rounded-none resize-none bg-white"
                                placeholder="Your snippet content..."
                            />
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute top-0 left-0 flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-bold uppercase">
                                <Code2 className="h-3 w-3" />
                                Preview
                            </div>
                            <pre className="mt-8 p-6 bg-muted border-2 border-black font-mono text-sm whitespace-pre-wrap break-words overflow-auto max-h-[400px]">
                                {snippet.content}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t-4 border-black bg-muted flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            {snippet.content.split("\n").length} lines •{" "}
                            {snippet.content.length} chars
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="h-10 px-4 rounded-none font-bold uppercase text-xs border-2 border-black hover:bg-black hover:text-white"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="h-10 px-6 rounded-none font-bold uppercase text-xs bg-accent text-white border-2 border-accent hover:bg-black hover:border-black"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCopy}
                                    className={`h-10 px-4 rounded-none font-bold uppercase text-xs border-2 transition-all ${
                                        isCopied
                                            ? "bg-accent text-white border-accent"
                                            : "border-black hover:bg-black hover:text-white"
                                    }`}
                                >
                                    {isCopied ? (
                                        <Check className="h-4 w-4 mr-2" />
                                    ) : (
                                        <Copy className="h-4 w-4 mr-2" />
                                    )}
                                    {isCopied ? "Copied!" : "Copy"}
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="h-10 px-6 rounded-none font-bold uppercase text-xs bg-black text-white border-2 border-black hover:bg-accent hover:border-accent"
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
