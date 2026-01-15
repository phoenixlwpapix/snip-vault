import { convexAuth } from "@convex-dev/auth/server";
import Resend from "@auth/core/providers/resend";

/**
 * Convex Auth Handler
 * 
 * Configures authentication with Resend provider for Magic Link email login.
 * Users will receive an email with a sign-in link - no password required!
 * 
 * Exports auth utilities used throughout the application:
 * - auth: Middleware for protected queries/mutations
 * - signIn: Sign in action
 * - signOut: Sign out action
 * - store: Auth store utilities
 * - isAuthenticated: Query to check auth status
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Resend({
            from: "SnipVault <noreply@studioyyh.tech>",
        }),
    ],
});
