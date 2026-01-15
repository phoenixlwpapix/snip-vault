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
    "General", "JavaScript", "TypeScript", "React", "Next.js", "CSS",
    "HTML", "Python", "SQL", "API", "Config", "Shell"
];

interface CreateSnippetDialogProps {
    children?: React.ReactNode;
}

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
            toast.error("Fields required");
            return;
        }

        setIsSubmitting(true);

        try {
            await createSnippet({
                title: title.trim(),
                content: content.trim(),
                category,
            });

            toast.success("Snippet archived");
            setTitle("");
            setContent("");
            setCategory("General");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to create");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!isSubmitting) {
            setOpen(newOpen);
            if (!newOpen) {
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
                    <Button className="h-10 px-6 font-bold uppercase tracking-wide border-2 border-transparent hover:border-black">
                        New Entry <Plus className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden border-4 border-black">
                <DialogHeader className="p-8 border-b-4 border-black bg-muted swiss-dots">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-black text-white flex items-center justify-center">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-3xl font-black uppercase tracking-tight">New Snippet</DialogTitle>
                            <DialogDescription className="text-black font-medium uppercase tracking-wide text-xs">
                                Archive new code logic
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label htmlFor="snippet-title" className="uppercase font-bold text-xs tracking-wider">
                                Title Identifier
                            </Label>
                            <Input
                                id="snippet-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="font-bold text-lg"
                                placeholder="E.G. AUTH_HOOK"
                                required
                                maxLength={100}
                                autoComplete="off"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="uppercase font-bold text-xs tracking-wider">Category Tag</Label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-1 text-xs font-bold uppercase border-2 transition-all ${category === cat
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-black border-black/20 hover:border-black"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="snippet-content" className="uppercase font-bold text-xs tracking-wider">
                            Source Code
                        </Label>
                        <Textarea
                            id="snippet-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[300px] font-mono text-sm border-2 border-black rounded-none p-4 focus-visible:ring-0 focus-visible:border-accent resize-none bg-muted/30"
                            placeholder="// Paste logic here..."
                            required
                        />
                    </div>

                    <DialogFooter className="pt-4 flex !justify-between border-t-2 border-black/10 mt-8">
                        <div className="text-xs text-muted-foreground uppercase font-bold self-center">
                            {content.length} characters
                        </div>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isSubmitting}
                                className="border-black hover:bg-black hover:text-white w-32"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-accent hover:bg-accent/90 text-white w-40 border-none"
                            >
                                {isSubmitting ? "Processing..." : "Save to Vault"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
