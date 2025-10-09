import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

interface SpotifySession extends Session {
  accessToken: string
  token: string
}

interface SpotifyJWT extends JWT {
  user: User | AdapterUser
  accessToken: string
  token: string
}

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {params: {scope: "playlist-modify-public playlist-modify-private playlist-read-private"}}
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
        accessToken: token.accessToken, // @ts-ignore
        token: token.token
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

      try {
          const response = await fetch('https://everynoise.com/research.cgi?mode=radio&name=spotify%3Aartist%3A1ZdhAl62G6ZlEKqIwUAfZR');
          const data = await response.text();
          const match = data.match(/var apiheader = \"{'Authorization': 'Bearer (.+)'}\";/);

          if (match) {
            SpotifyToken.token = match[1]; // Guarda el token en la sesión JWT
          }
      } catch (error) {
          console.error("Error al obtener el token externo:", error);
          SpotifyToken.token = ""; // En caso de error
      }

      return SpotifyToken;
    },
  }
});

export { handler as GET, handler as POST }
