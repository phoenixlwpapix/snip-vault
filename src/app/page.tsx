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
        <div className="flex h-16 md:h-20 items-stretch">
          <div className="flex items-center justify-center px-4 md:px-8 border-r-4 border-black bg-accent text-white">
            <Code2 className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          <div className="flex-1 flex items-center px-4 md:px-8">
            <span className="font-black text-xl md:text-2xl tracking-tighter uppercase">SnipVault<span className="text-accent">.</span></span>
          </div>
          <div className="flex items-center px-4 md:px-8 border-l-4 border-black hover:bg-black hover:text-white transition-colors cursor-pointer group">
            <Link href="/sign-in" className="font-bold text-sm md:text-base tracking-tight uppercase group-hover:text-white">
              <span className="hidden sm:inline">Login System</span>
              <span className="sm:hidden">Login</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Asymmetric Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh] lg:min-h-[calc(100vh-5rem)] border-b-4 border-black">
          {/* Main Headline Area - 8 Columns */}
          <div className="lg:col-span-8 p-6 sm:p-10 lg:p-16 xl:p-24 flex flex-col justify-between swiss-grid-pattern relative border-b-4 lg:border-b-0 lg:border-r-4 border-black">
            <div className="space-y-2">
              <span className="text-accent font-bold text-sm md:text-base tracking-widest uppercase mb-4 block">01. Introduction</span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-black">
                Code<br />
                Logic<br />
                Structure
              </h1>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="w-16 md:w-24 h-3 md:h-4 bg-black mb-4 md:mb-6"></div>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium max-w-xl leading-relaxed">
                The definitive archive for your code snippets.
                Objective storage. Universal access.
              </p>
            </div>
          </div>

          {/* Sidebar Area - 4 Columns */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-1 bg-muted p-6 sm:p-8 lg:p-12 swiss-dots border-b-4 border-black flex flex-col justify-center">
              <span className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-2 lg:mb-4 block">100%</span>
              <p className="font-bold text-sm lg:text-base uppercase tracking-wide">Sync Efficiency</p>
            </div>
            <div className="flex-1 bg-white p-6 sm:p-8 lg:p-12 border-b-4 border-black flex flex-col justify-center hover:invert transition-all group">
              <Link href="/sign-in" className="flex items-center justify-between w-full h-full">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase">Start Vault</span>
                <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </Link>
            </div>
            <div className="flex-1 bg-black p-6 sm:p-8 lg:p-12 flex flex-col justify-center text-white">
              <div className="flex items-center gap-3 lg:gap-4 mb-2">
                <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-accent" />
                <span className="font-mono text-xs lg:text-sm">POWERED BY CONVEX</span>
              </div>
              <p className="text-xs lg:text-sm text-gray-400">Real-time reactive backend integration.</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3">
          {/* Feature 01 */}
          <div className="border-b-4 md:border-r-4 border-black p-8 sm:p-10 lg:p-12 relative group hover:bg-muted transition-colors swiss-diagonal">
            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 text-accent font-black text-lg sm:text-xl">02.</span>
            <div className="mt-10 sm:mt-12 space-y-3 sm:space-y-4">
              <Shield className="h-10 w-10 lg:h-12 lg:w-12 mb-4 lg:mb-6" strokeWidth={1.5} />
              <h3 className="text-xl sm:text-2xl font-black uppercase">Secure Storage</h3>
              <p className="font-medium text-sm leading-6 max-w-xs">
                Private vaults protected by enterprise-grade authentication. Your logic remains yours.
              </p>
            </div>
          </div>

          {/* Feature 02 */}
          <div className="border-b-4 md:border-r-4 border-black p-8 sm:p-10 lg:p-12 relative group hover:bg-muted transition-colors">
            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 text-accent font-black text-lg sm:text-xl">03.</span>
            <div className="mt-10 sm:mt-12 space-y-3 sm:space-y-4">
              <RefreshCw className="h-10 w-10 lg:h-12 lg:w-12 mb-4 lg:mb-6" strokeWidth={1.5} />
              <h3 className="text-xl sm:text-2xl font-black uppercase">Instant Sync</h3>
              <p className="font-medium text-sm leading-6 max-w-xs">
                Modifications reflect immediately across all connected interfaces. No latency.
              </p>
            </div>
          </div>

          {/* Feature 03 */}
          <div className="border-b-4 border-black p-8 sm:p-10 lg:p-12 relative group hover:bg-muted transition-colors swiss-dots">
            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 text-accent font-black text-lg sm:text-xl">04.</span>
            <div className="mt-10 sm:mt-12 space-y-3 sm:space-y-4">
              <Code2 className="h-10 w-10 lg:h-12 lg:w-12 mb-4 lg:mb-6" strokeWidth={1.5} />
              <h3 className="text-xl sm:text-2xl font-black uppercase">Syntax Ready</h3>
              <p className="font-medium text-sm leading-6 max-w-xs">
                Preserves formatting for all major languages. Copy directly to clipboard.
              </p>
            </div>
          </div>
        </section>

        {/* Big Footer CTA */}
        <section className="bg-black text-white p-10 sm:p-16 lg:p-24 text-center border-b-4 border-black">
          <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
              Organize<br />
              Your Intellect
            </h2>
            <Link href="/sign-in">
              <Button size="lg" className="bg-white text-black hover:bg-accent hover:text-white border-none h-14 sm:h-16 lg:h-20 px-8 sm:px-12 lg:px-16 text-base sm:text-lg lg:text-xl mt-6 lg:mt-8">
                Initialize System
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center text-xs sm:text-sm font-bold uppercase tracking-wide">
        <div className="flex gap-4">
          <span>&copy; 2026 SnipVault</span>
        </div>
        <div className="flex gap-4 sm:gap-8">
          <a href="#" className="hover:text-accent">Documentation</a>
          <a href="#" className="hover:text-accent">System Status</a>
          <a href="#" className="hover:text-accent">Legal</a>
        </div>
      </footer>
    </div>
  );
}
