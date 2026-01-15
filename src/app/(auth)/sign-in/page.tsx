"use client";

import { SignInForm } from "@/components/sign-in-form";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Sign-In Page
 * 
 * Full-page authentication layout with gradient background
 * and centered sign-in form.
 */
export default function SignInPage() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

            {/* Floating orbs for visual interest */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-snip-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold gradient-text mb-2">SnipVault</h1>
                    <p className="text-muted-foreground">
                        Your personal code snippet sanctuary
                    </p>
                </div>

                {/* Sign-in form */}
                <SignInForm />

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-8">
                    Powered by{" "}
                    <a
                        href="https://convex.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Convex
                    </a>
                    {" "}— Real-time data, zero configuration
                </p>
            </div>
        </div>
    );
}
