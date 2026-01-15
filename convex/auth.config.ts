/**
 * Convex Auth Configuration
 * 
 * This file configures the authentication providers for your Convex backend.
 * Required for Convex Auth to function properly.
 */
export default {
    providers: [
        {
            domain: process.env.MY_CONVEX_URL ?? process.env.CONVEX_SITE_URL,
            applicationID: "convex",
        },
    ],
};
