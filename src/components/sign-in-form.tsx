"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";

/**
 * Sign-In Form Component
 * 
 * Handles both sign-in and sign-up flows using Convex Auth Password provider.
 * Features form validation, loading states, and error handling.
 */
export function SignInForm() {
    const { signIn } = useAuthActions();
    const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            formData.append("flow", flow);

            await signIn("password", formData);
        } catch (err) {
            setError(
                flow === "signIn"
                    ? "Invalid email or password. Please try again."
                    : "Could not create account. Email may already be registered."
            );
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
                        {flow === "signIn" ? "Welcome back" : "Create account"}
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                        {flow === "signIn"
                            ? "Sign in to access your snippets"
                            : "Start organizing your code snippets today"
                        }
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

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="h-11 bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder={flow === "signUp" ? "Create a password" : "Enter your password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                autoComplete={flow === "signIn" ? "current-password" : "new-password"}
                                className="h-11 pr-11 bg-background/50"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {flow === "signUp" && (
                            <p className="text-xs text-muted-foreground">
                                Password must be at least 6 characters
                            </p>
                        )}
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
                                {flow === "signIn" ? "Signing in..." : "Creating account..."}
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {flow === "signIn" ? "Sign in" : "Create account"}
                            </>
                        )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        {flow === "signIn" ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <button
                                    type="button"
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                    onClick={() => {
                                        setFlow("signUp");
                                        setError(null);
                                    }}
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                    onClick={() => {
                                        setFlow("signIn");
                                        setError(null);
                                    }}
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
