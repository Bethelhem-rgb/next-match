
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"
import NextAuth from "next-auth"
import authConfig from "./auth.config";

export const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: update
} = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        // Add type assertion to handle the role property
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Safely handle the role assignment
        const userWithRole = user as { role?: string };
        if (userWithRole.role) {
          token.role = userWithRole.role;
        }
      }
      return token;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  ...authConfig,
})
