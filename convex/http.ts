import { httpRouter } from "convex/server";
import { auth } from "./auth";

/**
 * HTTP Router for Convex
 * 
 * Adds authentication routes (signin, signout, callback, etc.)
 * to the Convex HTTP layer.
 */
const http = httpRouter();

// Add authentication HTTP routes
auth.addHttpRoutes(http);

export default http;
