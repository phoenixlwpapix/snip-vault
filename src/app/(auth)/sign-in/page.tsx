"use client";

import { SignInForm } from "@/components/sign-in-form";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background swiss-dots">

            {/* Top Back Link */}
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-2 font-bold uppercase text-xs tracking-widest hover:text-accent group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">SnipVault<span className="text-accent">.</span></h1>
                    <div className="h-1 w-24 bg-black mx-auto mb-4"></div>
                    <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground">
                        Secure Authentication Gateway
                    </p>
                </div>

                <SignInForm />

                <div className="text-center mt-12 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        System Status: <span className="text-green-600">Active</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                        Provided by Convex Auth 1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
