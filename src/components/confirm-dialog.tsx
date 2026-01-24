"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] p-0 border-4 border-black gap-0 overflow-hidden bg-background">
                <DialogHeader className="p-6 bg-muted border-b-4 border-black flex flex-row items-center gap-4 space-y-0">
                    <div className="h-12 w-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="font-bold text-xs uppercase tracking-wide text-muted-foreground">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="p-6 bg-background flex !justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 h-12 border-2 border-black rounded-none font-bold uppercase hover:bg-black hover:text-white transition-all"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === "destructive" ? "destructive" : "default"}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 h-12 rounded-none font-bold uppercase border-2 border-transparent transition-all ${variant === "destructive"
                                ? "bg-red-500 hover:bg-red-600 text-white border-red-700"
                                : "bg-accent hover:bg-accent/90 text-white border-accent"
                            }`}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
