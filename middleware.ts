import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// lets NextAuth handle the core authentication/authorization checks based on the logic defined in auth.config.ts
export default NextAuth(authConfig).auth;

// Middleware config: defines paths to match via 'matcher'
export const config = {
    // Matcher excludes API, internal, and static file paths; adjust as needed
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|images/|assets/).*)'],
};