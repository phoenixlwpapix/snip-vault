/**
 * Convex Auth Configuration
 * 
 * This file configures the authentication providers for your Convex backend.
 * For Convex Auth's built-in providers (like Password), the domain should be
 * the Convex site URL (e.g., https://YOUR-PROJECT.convex.site)
 */
export default {
    providers: [
        {
            domain: process.env.AUTH_DOMAIN ?? process.env.CONVEX_SITE_URL,
            applicationID: "convex",
        },
    ],
};

