"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

/**
 * Convex Client Provider
 * 
 * Wraps the application with ConvexAuthNextjsProvider for real-time data syncing
 * and authentication support throughout the app.
 * 
 * ⚡ REAL-TIME: All useQuery hooks within this provider will automatically
 * update when the underlying data changes - no manual revalidation needed!
 */

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexAuthNextjsProvider client={convex}>
            {children}
        </ConvexAuthNextjsProvider>
    );
}
