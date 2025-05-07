import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

// Define the paths that require authentication
const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
];

export const authConfig = {
    // Define custom pages for NextAuth actions
    pages: {
        signIn: '/sign-in', // Redirect unauthenticated users to this page
        error: '/sign-in',  // Redirect users here if sign-in fails (or other auth errors)
    },
    callbacks: {
        /**
         * The 'authorized' callback is crucial for middleware.
         * It runs before a request is completed on paths defined in middleware.ts's matcher.
         * Use it to protect routes and handle other request-level checks.
         */
        authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user; // Check if the user session exists
            const { pathname } = request.nextUrl; // Get the path the user is trying to access

            // Determine if the current path is one of the protected paths
            const isProtected = protectedPaths.some((p) => p.test(pathname));

            let response: NextResponse | boolean = true; // Default to allowing the request

            // Ensure every request (that the middleware runs on) has a sessionCartId cookie
            if (!request.cookies.get('sessionCartId')) {
                const sessionCartId = crypto.randomUUID();
                // We need a response object to set a cookie
                const nextResponse = NextResponse.next({ request }); // Pass request to maintain headers
                nextResponse.cookies.set('sessionCartId', sessionCartId);
                response = nextResponse; // This response (potentially with the new cookie) will be returned if access is granted
            }

            // If the path is protected and the user is not logged in
            if (isProtected && !isLoggedIn) {
                // Construct the sign-in URL with a callbackUrl query parameter
                const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search); // Preserve original path and query params
                const signInUrl = new URL(`/sign-in?callbackUrl=${callbackUrl}`, request.nextUrl.origin);
                return NextResponse.redirect(signInUrl); // Redirect to the sign-in page immediately
            }

            // If the path is not protected, or if the user is logged in,
            // return true (allow access) or the response object (if a cookie was set).
            return response;
        },
    },
    providers: [], // Providers (like Credentials) are defined in the main auth.ts, not needed for middleware logic usually.
} satisfies NextAuthConfig;