"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, Zap, Shield, RefreshCw, ArrowRight, Plus } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Landing Page - Swiss International Style
 * 
 * Philosophy: Objectivity, Clarity, Grid-based structure.
 * Visuals: Inter font, Black/White/Red palette, visible borders, massive typography.
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
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-white">
      {/* Header - Sticky, Thick Border */}
      <header className="sticky top-0 z-50 bg-background border-b-4 border-black">
        <div className="flex h-20 items-stretch">
          <div className="flex items-center justify-center px-8 border-r-4 border-black bg-accent text-white">
            <Code2 className="h-8 w-8" />
          </div>
          <div className="flex-1 flex items-center px-8">
            <span className="font-black text-2xl tracking-tighter uppercase">SnipVault<span className="text-accent">.</span></span>
          </div>
          <div className="flex items-center px-8 border-l-4 border-black hover:bg-black hover:text-white transition-colors cursor-pointer group">
            <Link href="/sign-in" className="font-bold tracking-tight uppercase group-hover:text-white">
              Login System
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Asymmetric Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh] border-b-4 border-black">
          {/* Main Headline Area - 8 Columns */}
          <div className="lg:col-span-8 p-12 lg:p-24 flex flex-col justify-between swiss-grid-pattern relative border-b-4 lg:border-b-0 lg:border-r-4 border-black">
            <div className="space-y-2">
              <span className="text-accent font-bold tracking-widest uppercase mb-4 block">01. Introduction</span>
              <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-black">
                Code<br />
                Logic<br />
                Structure
              </h1>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="w-24 h-4 bg-black mb-6"></div>
              <p className="text-xl lg:text-2xl font-medium max-w-xl leading-relaxed">
                The definitive archive for your code snippets.
                Objective storage. Universal access.
              </p>
            </div>
          </div>

          {/* Sidebar Area - 4 Columns */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-1 bg-muted p-12 swiss-dots border-b-4 border-black flex flex-col justify-center">
              <span className="font-bold text-6xl mb-4 block">100%</span>
              <p className="font-bold uppercase tracking-wide">Sync Efficiency</p>
            </div>
            <div className="flex-1 bg-white p-12 border-b-4 border-black flex flex-col justify-center hover:invert transition-all group">
              <Link href="/sign-in" className="flex items-center justify-between w-full h-full">
                <span className="text-4xl font-black uppercase">Start Vault</span>
                <ArrowRight className="h-12 w-12 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </Link>
            </div>
            <div className="flex-1 bg-black p-12 flex flex-col justify-center text-white">
              <div className="flex items-center gap-4 mb-2">
                <Zap className="h-6 w-6 text-accent" />
                <span className="font-mono text-sm">POWERED BY CONVEX</span>
              </div>
              <p className="text-sm text-gray-400">Real-time reactive backend integration.</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3">
          {/* Feature 01 */}
          <div className="border-r-4 border-b-4 border-black p-12 relative group hover:bg-muted transition-colors swiss-diagonal">
            <span className="absolute top-6 left-6 text-accent font-black text-xl">02.</span>
            <div className="mt-12 space-y-4">
              <Shield className="h-12 w-12 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-black uppercase">Secure Storage</h3>
              <p className="font-medium text-sm leading-6 max-w-xs">
                Private vaults protected by enterprise-grade authentication. Your logic remains yours.
              </p>
            </div>
          </div>

          {/* Feature 02 */}
          <div className="border-r-4 border-b-4 border-black p-12 relative group hover:bg-muted transition-colors">
            <span className="absolute top-6 left-6 text-accent font-black text-xl">03.</span>
            <div className="mt-12 space-y-4">
              <RefreshCw className="h-12 w-12 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-black uppercase">Instant Sync</h3>
              <p className="font-medium text-sm leading-6 max-w-xs">
                Modifications reflect immediately across all connected interfaces. No latency.
              </p>
            </div>
          </div>

          {/* Feature 03 */}
          <div className="border-b-4 border-black p-12 relative group hover:bg-muted transition-colors swiss-dots">
            <span className="absolute top-6 left-6 text-accent font-black text-xl">04.</span>
            <div className="mt-12 space-y-4">
              <Code2 className="h-12 w-12 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-black uppercase">Syntax Ready</h3>
              <p className="font-medium text-sm leading-6 max-w-xs">
                Preserves formatting for all major languages. Copy directly to clipboard.
              </p>
            </div>
          </div>
        </section>

        {/* Big Footer CTA */}
        <section className="bg-black text-white p-24 text-center border-b-4 border-black">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Organize<br />
              Your Intellect
            </h2>
            <Link href="/sign-in">
              <Button size="lg" className="bg-white text-black hover:bg-accent hover:text-white border-none h-20 px-16 text-xl mt-8">
                Initialize System
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="p-8 md:flex justify-between items-center text-sm font-bold uppercase tracking-wide">
        <div className="flex gap-4">
          <span>&copy; 2026 SnipVault</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-accent">Documentation</a>
          <a href="#" className="hover:text-accent">System Status</a>
          <a href="#" className="hover:text-accent">Legal</a>
        </div>
      </footer>
    </div>
  );
}
