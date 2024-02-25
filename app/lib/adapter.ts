/**
 * Custom adapter for Vercel's PostgreSQL.
 */

import type {
  Adapter,
  AdapterUser,
  VerificationToken,
  AdapterSession,
} from "@auth/core/adapters"
import { sql } from "@vercel/postgres"

export function mapExpiresAt(account: any): any {
  const expires_at: number = parseInt(account.expires_at)
  return {
    ...account,
    expires_at,
  }
}

/**
 * ## Setup
 *
 * The SQL schema for the tables used by this adapter is as follows. Learn more about the models at our doc page on [Database Models](https://authjs.dev/getting-started/adapters#models).
 *
 * ```sql
 * CREATE TABLE verification_token
 * (
 *   identifier TEXT NOT NULL,
 *   expires TIMESTAMPTZ NOT NULL,
 *   token TEXT NOT NULL,
 *
 *   PRIMARY KEY (identifier, token)
 * );
 *
 * CREATE TABLE accounts
 * (
 *   id SERIAL,
 *   "userId" INTEGER NOT NULL,
 *   type VARCHAR(255) NOT NULL,
 *   provider VARCHAR(255) NOT NULL,
 *   "providerAccountId" VARCHAR(255) NOT NULL,
 *   refresh_token TEXT,
 *   access_token TEXT,
 *   expires_at BIGINT,
 *   id_token TEXT,
 *   scope TEXT,
 *   session_state TEXT,
 *   token_type TEXT,
 *
 *   PRIMARY KEY (id)
 * );
 *
 * CREATE TABLE sessions
 * (
 *   id SERIAL,
 *   "userId" INTEGER NOT NULL,
 *   expires TIMESTAMPTZ NOT NULL,
 *   "sessionToken" VARCHAR(255) NOT NULL,
 *
 *   PRIMARY KEY (id)
 * );
 *
 * CREATE TABLE users
 * (
 *   id SERIAL,
 *   name VARCHAR(255),
 *   email VARCHAR(255),
 *   "emailVerified" TIMESTAMPTZ,
 *   image TEXT,
 *
 *   PRIMARY KEY (id)
 * );
 *
 * ```
 *
 * ```typescript title="auth.ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import PostgresAdapter from "@auth/pg-adapter"
 * import { Pool } from 'pg'
 *
 * const pool = new Pool({
 *   host: 'localhost',
 *   user: 'database-user',
 *   max: 20,
 *   idleTimeoutMillis: 30000,
 *   connectionTimeoutMillis: 2000,
 * })
 *
 * export default NextAuth({
 *   adapter: PostgresAdapter(pool),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 */
export default function VercelAdapter(): Adapter {
  return {
    async createVerificationToken(
      verificationToken: VerificationToken
    ): Promise<VerificationToken> {
      const { identifier, expires, token } = verificationToken
      await sql`
      INSERT INTO verification_token ( identifier, expires, token ) 
      VALUES (${identifier}, ${expires.toJSON()}, ${token})
      `
      return verificationToken
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string
      token: string
    }): Promise<VerificationToken> {
      const result = await sql`
      delete from verification_token
      where identifier = ${identifier} and token = ${token}
      RETURNING identifier, expires, token
      `
      return (result.rowCount !== 0 ? result.rows[0] : null) as VerificationToken
    },

    async createUser(user: Omit<AdapterUser, "id">) {
      const { name, email, emailVerified, image } = user

      const result = await sql`
      INSERT INTO users (name, email, "emailVerified", image) 
      VALUES (${name}, ${email}, ${emailVerified?.toJSON()}, ${image}) 
      RETURNING id, name, email, "emailVerified", image`

      return result.rows[0] as AdapterUser;
    },
    async getUser(id) {
      try {
        const result = await sql`select * from users where id = ${id}`
        return result.rowCount === 0 ? null : result.rows[0] as AdapterUser
      } catch (e) {
        return null
      }
    },
    async getUserByEmail(email) {
      const result = await sql`select * from users where email = ${email}`
      return (result.rowCount !== 0 ? result.rows[0] : null) as AdapterUser
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser | null> {
      const result = await sql`
      select u.* from users u join accounts a on u.id = a."userId"
      where 
      a.provider = ${provider} 
      and 
      a."providerAccountId" = ${providerAccountId}`
      return (result.rowCount !== 0 ? result.rows[0] : null) as AdapterUser
    },
    async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
      const query1 = await sql`select * from users where id = ${user.id}`
      const oldUser = query1.rows[0]

      const newUser = {
        ...oldUser,
        ...user,
      }

      const { id, name, email, emailVerified, image } = newUser
      
      const query2 = await sql`
      UPDATE users set
      name = ${name}, email = ${email}, "emailVerified" = ${emailVerified?.toJSON()}, image = ${image}
      where id = ${id}
      RETURNING name, id, email, "emailVerified", image
    `
      return query2.rows[0] as AdapterUser
    },
    async linkAccount(account) {
      const result = await sql`
      insert into accounts 
      (
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      )
      values (
        ${account.userId}, 
        ${account.provider}, 
        ${account.type}, 
        ${account.providerAccountId}, 
        ${account.access_token}, 
        ${account.expires_at},
        ${account.refresh_token}, 
        ${account.id_token}, 
        ${account.scope}, 
        ${account.session_state?.toString()}, 
        ${account.token_type})
      returning
        id,
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      `
      return mapExpiresAt(result.rows[0])
    },
    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error(`userId is undef in createSession`)
      }      
      console.log('expires.toString(): ', expires.toString())
      console.log('expires.toJSON(): ', expires.toJSON())
      const result = await sql`
      insert into sessions ("userId", expires, "sessionToken")
      values (${userId}, ${expires.toJSON()}, ${sessionToken})
      RETURNING id, "sessionToken", "userId", expires`
      console.log('result.rows[0]: ', result.rows[0])
      return result.rows[0] as AdapterSession
    },

    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession
      user: AdapterUser
    } | null> {
      if (sessionToken === undefined) {
        return null
      }
      const result1 = await sql`select * from sessions where "sessionToken" = ${sessionToken}`
      if (result1.rowCount === 0) {
        return null
      }
      let session: AdapterSession = result1.rows[0] as AdapterSession

      const result2 = await sql`select * from users where id = ${session.userId}`
      if (result2.rowCount === 0) {
        return null
      }
      const user = result2.rows[0] as AdapterUser
      return {
        session,
        user,
      }
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken } = session
      const result1 = await sql`select * from sessions where "sessionToken" = ${sessionToken}`
      if (result1.rowCount === 0) {
        return null
      }
      const originalSession: AdapterSession = result1.rows[0] as AdapterSession

      const newSession: AdapterSession = {
        ...originalSession,
        ...session,
      }

      const result = await sql`UPDATE sessions set expires = ${newSession.expires.toJSON()} where "sessionToken" = ${newSession.sessionToken}`
      return result.rows[0] as AdapterSession;
    },
    async deleteSession(sessionToken) {
      await sql`delete from sessions where "sessionToken" = ${sessionToken}`
    },
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount
      await sql`delete from accounts where "providerAccountId" = ${providerAccountId} and provider = ${provider}`
    },
    async deleteUser(userId: string) {
      await sql`delete from users where id = ${userId}`
      await sql`delete from sessions where "userId" = ${userId}`
      await sql`delete from accounts where "userId" = ${userId}`
    },
  }
}
