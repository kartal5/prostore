import NextAuth from 'next-auth';
import { authConfig } from './auth.config'; // Import the specific configuration for middleware

/**
 * Export the 'auth' middleware function initialized with our authConfig.
 * This lets NextAuth handle the core authentication/authorization checks
 * based on the logic defined in auth.config.ts (specifically the 'authorized' callback).
 */
export default NextAuth(authConfig).auth;

/**
 * Configuration for the Next.js Middleware.
 * The `matcher` specifies which paths this middleware should run on.
 */
export const config = {
    // This matcher prevents the middleware from running on:
    // - API routes (/api/...)
    // - Next.js internal paths (/_next/...)
    // - Static files typically found in /public (e.g., .png, .ico)
    // Adjust this pattern if you have other paths to exclude or include.
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|images/|assets/).*)'],
};