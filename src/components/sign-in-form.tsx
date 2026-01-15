"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Loader2, Sparkles, Mail, CheckCircle2 } from "lucide-react";

/**
 * Sign-In Form Component
 * 
 * Handles Magic Link authentication flow using Convex Auth with Resend.
 * Users enter their email and receive a sign-in link - no password required!
 */
export function SignInForm() {
    const { signIn } = useAuthActions();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("email", email);

            // "resend" is the provider ID (lowercase version of the provider name)
            await signIn("resend", formData);
            setEmailSent(true);
        } catch (err) {
            console.error("Sign in error:", err);
            setError("Failed to send magic link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show success message after email is sent
    if (emailSent) {
        return (
            <Card className="w-full max-w-md glass animate-slide-up">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold gradient-text">
                            Check your email
                        </CardTitle>
                        <CardDescription className="mt-2 text-muted-foreground">
                            We&apos;ve sent a magic link to <strong className="text-foreground">{email}</strong>
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-primary mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                                <p>Click the link in your email to sign in.</p>
                                <p className="mt-1">The link will expire in 24 hours.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setEmailSent(false);
                            setEmail("");
                        }}
                    >
                        Try a different email
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                        Didn&apos;t receive the email? Check your spam folder or try again.
                    </p>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md glass animate-slide-up">
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-glow">
                    <Code2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-3xl font-bold gradient-text">
                        Welcome to SnipVault
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                        Enter your email to receive a magic sign-in link
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

                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                            <p className="text-xs text-muted-foreground">
                                No password needed! We&apos;ll email you a secure sign-in link.
                            </p>
                        </div>
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
                                Sending magic link...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Send magic link
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
