import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Protect dashboard routes
      const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || 
                               nextUrl.pathname.startsWith('/opener') || 
                               nextUrl.pathname.startsWith('/stats') || 
                               nextUrl.pathname.startsWith('/ranking') || 
                               nextUrl.pathname.startsWith('/admin');
      const isOpenRoute = nextUrl.pathname.startsWith('/privacy')
      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOpenRoute) {
        return true;
      } else if (isLoggedIn) {
        // Default redirect for authenticated users
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;