"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Sparkles, Code2 } from "lucide-react";

const CATEGORIES = [
    "General",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "CSS",
    "HTML",
    "Python",
    "SQL",
    "API",
    "Config",
    "Shell",
];

interface CreateSnippetDialogProps {
    children?: React.ReactNode;
}

/**
 * Create Snippet Dialog Component
 * 
 * A modal dialog for creating new code snippets.
 * Features:
 * - Title and content inputs
 * - Category selection via quick buttons
 * - Form validation
 * - Loading states
 * - Success/error toast feedback
 * 
 * ⚡ REAL-TIME: New snippets appear instantly for all connected clients!
 */
export function CreateSnippetDialog({ children }: CreateSnippetDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createSnippet = useMutation(api.snippets.create);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            await createSnippet({
                title: title.trim(),
                content: content.trim(),
                category,
            });

            toast.success("Snippet created!", {
                description: `"${title.trim()}" has been added to your vault`,
                icon: <Sparkles className="h-4 w-4" />,
            });

            // Reset form and close dialog
            setTitle("");
            setContent("");
            setCategory("General");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to create snippet", {
                description: "Please try again",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!isSubmitting) {
            setOpen(newOpen);
            if (!newOpen) {
                // Reset form when closing
                setTitle("");
                setContent("");
                setCategory("General");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="gap-2 font-semibold">
                        <Plus className="h-4 w-4" />
                        New Snippet
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Code2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Create Snippet</DialogTitle>
                            <DialogDescription>
                                Add a new code snippet to your vault
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="snippet-title" className="text-sm font-medium">
                            Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="snippet-title"
                            placeholder="e.g., React useEffect cleanup"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-11"
                            required
                            maxLength={100}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Category</Label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <Button
                                    key={cat}
                                    type="button"
                                    variant={category === cat ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCategory(cat)}
                                    className={`text-xs transition-all duration-200 ${category === cat
                                            ? "shadow-md"
                                            : "hover:bg-primary/5 hover:border-primary/30"
                                        }`}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="snippet-content" className="text-sm font-medium">
                            Code / Content <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="snippet-content"
                            placeholder="Paste your code snippet here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px] font-mono text-sm resize-y"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Tip: You can paste multi-line code directly
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="gap-2">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Create Snippet
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
