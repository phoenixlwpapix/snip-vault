"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, Zap, Shield, RefreshCw, ArrowRight } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Landing Page
 * 
 * Public-facing homepage showcasing SnipVault features.
 * Users are directed to sign in to access the dashboard.
 * 
 * ⚡ REDIRECT logic added: If user is authenticated, automatically redirect to dashboard.
 */
export default function HomePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl gradient-text">SnipVault</span>
          </div>

          <Link href="/sign-in">
            <Button className="font-semibold">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-snip-accent/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="h-4 w-4" />
                <span>Powered by Convex — Real-time sync</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="gradient-text">Your Code Snippets,</span>
                <br />
                <span className="text-foreground">Always Within Reach</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Store, organize, and instantly access your most-used code snippets.
                Real-time sync across all devices with zero configuration.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-in">
                  <Button size="lg" className="h-12 px-8 font-semibold gap-2">
                    Start Building Your Vault
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built for developers who value simplicity and speed.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border bg-card/50 space-y-4 transition-all hover:shadow-lg hover:border-primary/30">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Sync</h3>
                <p className="text-muted-foreground text-sm">
                  Create a snippet on your laptop, access it instantly on your phone.
                  No refresh needed — powered by Convex&apos;s reactive architecture.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border bg-card/50 space-y-4 transition-all hover:shadow-lg hover:border-primary/30">
                <div className="h-12 w-12 rounded-xl bg-snip-accent/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-snip-accent" />
                </div>
                <h3 className="text-xl font-semibold">One-Click Copy</h3>
                <p className="text-muted-foreground text-sm">
                  Copy any snippet to your clipboard with a single click.
                  Paste directly into your editor — no formatting issues.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border bg-card/50 space-y-4 transition-all hover:shadow-lg hover:border-primary/30">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure by Default</h3>
                <p className="text-muted-foreground text-sm">
                  Your snippets are private to you. Convex Auth ensures
                  only you can access your vault with end-to-end authentication.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Organize Your Code?
              </h2>
              <p className="text-muted-foreground">
                Join developers who save hours with instant snippet access.
              </p>
              <Link href="/sign-in">
                <Button size="lg" className="h-12 px-8 font-semibold gap-2">
                  Get Started — It&apos;s Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Code2 className="h-4 w-4" />
            <span>SnipVault — SaaS Starter Template</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Tailwind CSS, and{" "}
            <a
              href="https://convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Convex
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
