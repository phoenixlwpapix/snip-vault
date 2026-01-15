import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

/**
 * Convex Auth Handler
 *
 * Configures authentication with Password provider.
 * Users will sign in with email and password.
 *
 * Exports auth utilities used throughout the application:
 * - auth: Middleware for protected queries/mutations
 * - signIn: Sign in action
 * - signOut: Sign out action
 * - store: Auth store utilities
 * - isAuthenticated: Query to check auth status
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Password],
});
