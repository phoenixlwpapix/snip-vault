import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

/**
 * Next.js Middleware for Route Protection
 * 
 * Uses Convex Auth middleware to:
 * 1. Redirect authenticated users away from sign-in page to dashboard
 * 2. Redirect unauthenticated users from protected routes to sign-in
 * 
 * Protected routes: /dashboard and all sub-routes
 */

const isSignInPage = createRouteMatcher(["/sign-in"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    // If user is on sign-in page but already authenticated, redirect to dashboard
    if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/dashboard");
    }

    // If user tries to access protected route without authentication, redirect to sign-in
    if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/sign-in");
    }
});

export const config = {
    // Run middleware on all routes except static assets and internals
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
