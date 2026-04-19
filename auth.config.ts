import type { NextAuthConfig } from 'next-auth';

const PUBLIC_PATHS = ['/', '/login', '/privacy'];
const PUBLIC_PREFIXES = ['/api/'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith('/join/')) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { nextUrl } = request;
      const { pathname } = nextUrl;

      if (isPublicPath(pathname)) {
        if (isLoggedIn && (pathname === '/' || pathname === '/login')) {
          const callbackUrl = nextUrl.searchParams.get('callbackUrl');
          // Auth.js passes callbackUrl as an absolute URL — extract pathname if same origin to prevent open redirect
          let destination: string | null = null;
          if (callbackUrl) {
            if (callbackUrl.startsWith('/')) {
              destination = callbackUrl;
            } else {
              try {
                const parsed = new URL(callbackUrl);
                if (parsed.origin === nextUrl.origin) {
                  destination = parsed.pathname + parsed.search;
                }
              } catch {
                // invalid URL, ignore
              }
            }
          }
          if (!destination) {
            const userId = auth?.user?.id;
            const lastLocation = userId ? request.cookies.get(`last-location-${userId}`)?.value : undefined;
            destination = lastLocation ? `/${lastLocation}/tracks` : '/locations';
          }
          return Response.redirect(new URL(destination, nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;