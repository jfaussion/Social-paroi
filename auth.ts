import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import GithubProvider from "next-auth/providers/github";

export const { 
  handlers: { GET, POST },
  auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
      GithubProvider({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      })]
  });