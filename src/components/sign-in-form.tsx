"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Loader2, CheckCircle2 } from "lucide-react";

/**
 * Sign-In Form Component
 * 
 * Handles Magic Link authentication flow using Convex Auth with Resend.
 * Users enter their email and receive a sign-in link - no password required!
 */
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
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md glass animate-slide-up">
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-glow">
                    <Code2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-3xl font-bold gradient-text">
                        {step === "signIn" ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                        {step === "signIn"
                            ? "Enter your credentials to access your vault"
                            : "Sign up to start saving your snippets"}
                    </CardDescription>
                </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                    {error && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 animate-fade-in">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="h-11 bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete={step === "signIn" ? "current-password" : "new-password"}
                                className="h-11 bg-background/50"
                            />
                        </div>
                        <input name="flow" type="hidden" value={step} />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button
                        type="submit"
                        className="w-full h-11 font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {step === "signIn" ? "Signing in..." : "Creating account..."}
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {step === "signIn" ? "Sign in" : "Sign up"}
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
                    >
                        {step === "signIn" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
