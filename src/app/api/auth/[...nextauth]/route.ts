// Archivo next-auth.js

import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

interface SpotifySession extends Session {
  accessToken: string
}

interface SpotifyJWT extends JWT {
  user: User | AdapterUser
  accessToken: string
}

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.CLIENTID || "",
      clientSecret: process.env.CLIENTSECRET || "",
      authorization: {params: {scope: "user-read-email playlist-modify-public playlist-modify-private playlist-read-private"}}
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}`
      else if (new URL(url).origin === baseUrl) return baseUrl
      return baseUrl
    },
    async session({ session, token, user }) {

      const SpotifySession: SpotifySession = {
        ...session, // @ts-ignore
        user: token.user, // @ts-ignore
        accessToken: token.accessToken
      };

      return SpotifySession;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // @ts-ignore
      const SpotifyToken: SpotifyJWT = {
        ...token,
      }

      if (account) {
        SpotifyToken.accessToken = account.access_token || ""
      }

      if (user) {
        SpotifyToken.user = user
      }

      return SpotifyToken;
    },
  }
});

export { handler as GET, handler as POST }
