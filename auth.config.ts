import type { NextAuthConfig } from 'next-auth';

const PUBLIC_PATHS = ['/', '/login', '/privacy'];
const PUBLIC_PREFIXES = ['/api/'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (isPublicPath(pathname)) {
        // Authenticated users visiting / or /login are redirected to /locations
        if (isLoggedIn && (pathname === '/' || pathname === '/login')) {
          return Response.redirect(new URL('/locations', nextUrl));
        }
        return true;
      }

      // Everything else requires authentication
      if (!isLoggedIn) {
        return false; // Redirects to signIn page
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
