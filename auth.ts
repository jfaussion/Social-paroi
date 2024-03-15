import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client/edge';
import { PrismaAdapter } from '@auth/prisma-adapter';

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
        async jwt({ token, user}) {
          if (user?.id) {
            token.id = user.id
          }
          return token
        },
        async session({ session, token, user }) {
          session.user.id = token.id as string;
          return session
        }
      },
      
  });