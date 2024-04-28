import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client/edge';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { AdapterUserCustom } from './lib/AdapterUserCustom';

const prisma = new PrismaClient()

export const { 
  handlers: { GET, POST },
  auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
      GithubProvider({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
      GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      })],
      session: {
        strategy: "jwt",
      },
      callbacks: {
        async jwt({ token, user }) {
          if (user?.id) {
            token.id = user.id
            token.role = (user as { role: string }).role;
          }
          return token
        },
        async session({ session, token }) {
          session.user = {
            id: token.id as string,
            role: token.role as string
          } as AdapterUserCustom;
          return session
        }
      },
      
  });