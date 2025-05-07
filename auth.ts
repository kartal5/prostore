import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge'; // Using your synchronous version
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers'; // Correct import for server-side cookie access

// Main configuration for NextAuth.js (used for API routes, server components, etc.)
export const mainAuthConfig = {
    pages: {
       signIn: '/sign-in',
       error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;
                const user = await prisma.user.findFirst({
                    where: { email: credentials.email as string },
                });
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password);
                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        };
                    }
                }
                return null;
            },
        }),
    ],
    callbacks: {
        // The 'authorized' callback is handled by auth.config.ts for middleware.

        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.sub ?? token.id;
                session.user.role = token.role;
                session.user.name = token.name;
            }
            return session;
        },

        // Removed unused 'account' and 'profile' parameters from the signature
        async jwt({ token, user, trigger, session: updateSession }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;

                if (user.name === 'NO_NAME' && user.email) {
                    token.name = user.email.split('@')[0];
                    prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name },
                    }).catch(console.error);
                }

                // Merge guest cart to user cart on sign-in or sign-up
                if (trigger === 'signIn' || trigger === 'signUp') {
                    try {
                        // Correctly await the cookies() function
                        const cookiesObject = await cookies();
                        const sessionCartId = cookiesObject.get('sessionCartId')?.value;

                        if (sessionCartId) {
                            const sessionCart = await prisma.cart.findFirst({
                                where: { sessionCartId: sessionCartId },
                            });

                            if (sessionCart) {
                                await prisma.$transaction(async (tx) => {
                                    await tx.cart.deleteMany({
                                        where: { userId: user.id },
                                    });
                                    // Correctly update only the userId, removing sessionCartId assignment
                                    await tx.cart.update({
                                        where: { id: sessionCart.id },
                                        data: {
                                            userId: user.id,
                                            // sessionCartId: null, // REMOVED: Avoid assigning null if field is not nullable
                                        },
                                    });
                                });
                                // Optionally delete the cookie after successful merge
                                // cookies().delete('sessionCartId');
                            }
                        }
                    } catch (e) {
                       console.error("Error merging cart during JWT callback:", e);
                    }
                }
            }

            if (trigger === 'update' && updateSession?.user?.name) {
                 token.name = updateSession.user.name;
            }

            return token;
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(mainAuthConfig);