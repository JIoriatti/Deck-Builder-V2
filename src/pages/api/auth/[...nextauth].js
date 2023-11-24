import NextAuth, {NextAuthOptions} from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "lib/prisma";
import CredentialsProvder from 'next-auth/providers/credentials'

const authOptions = {
    adapter: PrismaAdapter(prisma),
  
    providers: [
      
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          })
    ],
    callbacks: {
        session: async ({ session, token, user }) => {
          if (session?.user) {
            session.user.id = user.id;
          }
          return session;
        },
    },
    secret: process.env.JWT_SECRET,
  
    session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60

  }
}

export default NextAuth(authOptions);