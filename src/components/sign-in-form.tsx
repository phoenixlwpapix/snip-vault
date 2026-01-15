"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SignInForm() {
    const { signIn } = useAuthActions();
    const [step, setStep] = useState<"signUp" | "signIn">("signIn");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            await signIn("password", formData);
        } catch (err) {
            console.error("Sign in error:", err);
            setError("Authentication failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white border-4 border-black p-8 relative swiss-grid-pattern">
            {/* Decorative corner */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent border-4 border-black z-10"></div>

            <div className="text-center space-y-4 mb-8 relative z-20">
                <div className="mx-auto w-16 h-16 bg-black flex items-center justify-center text-white">
                    <Code2 className="h-8 w-8" />
                </div>
                <div>
                    <span className="text-accent font-bold uppercase tracking-widest text-xs display-block mb-1">
                        System Access
                    </span>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        {step === "signIn" ? "Login" : "Register"}
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-20 bg-white p-6 border-2 border-black">
                {error && (
                    <div className="p-4 bg-destructive text-white text-sm font-bold border-2 border-black">
                        ERROR: {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="uppercase font-bold text-xs">Email Identity</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="USER@DOMAIN.COM"
                            required
                            autoComplete="email"
                            className="h-12 border-2 border-black bg-muted/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="uppercase font-bold text-xs">Passkey</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            autoComplete={step === "signIn" ? "current-password" : "new-password"}
                            className="h-12 border-2 border-black bg-muted/20"
                        />
                    </div>
                    <input name="flow" type="hidden" value={step} />
                </div>

                <div className="pt-4 space-y-4">
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-black uppercase tracking-wide bg-black text-white hover:bg-accent hover:border-transparent"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {step === "signIn" ? "Authenticate" : "Confirm Registration"}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-10 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-transparent hover:text-black underline decoration-2 decoration-accent underline-offset-4"
                        onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
                    >
                        {step === "signIn" ? "Switch to Registration ->" : "Switch to Login ->"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
