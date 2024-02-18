import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import GithubProvider from "next-auth/providers/github";
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

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