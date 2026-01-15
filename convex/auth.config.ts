/**
 * Convex Auth Configuration
 * 
 * This file configures the authentication providers for your Convex backend.
 * Required for Convex Auth to function properly.
 * 
 * SITE_URL should be set to your production domain (e.g., https://snip.studioyyh.tech)
 */
export default {
    providers: [
        {
            domain: process.env.SITE_URL,
            applicationID: "convex",
        },
    ],
};
