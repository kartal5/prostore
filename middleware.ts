import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Secret should match what you have in your .env file for NEXTAUTH_SECRET
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  // Pass the secret to getToken
  const token = await getToken({ 
    req: request,
    secret: secret 
  });
  
// Protected paths defined here run at the EDGE (before page rendering) to redirect unauthenticated users
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ];
  
  // Get pathname from the req URL object
  const { pathname } = request.nextUrl;
  
  // Check if user is not authenticated and accessing a protected path
  const isProtectedPath = protectedPaths.some(pattern => pattern.test(pathname));
  if (!token && isProtectedPath) {
    // Redirect to sign-in page with callback URL
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // If we get here, either the user is authenticated or the path doesn't need protection
  // Handle session cart ID
  if (!request.cookies.get('sessionCartId')) {
    const response = NextResponse.next();
    response.cookies.set('sessionCartId', crypto.randomUUID());
    return response;
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Keep your existing matcher
export const config = {
  matcher: ['/(.*)'],
};