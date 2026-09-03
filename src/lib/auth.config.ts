import type { NextAuthConfig } from "next-auth";

// Shared config without Prisma so it can also run in the proxy layer.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "ADMIN" | "VIEWER";
      session.user.username = token.username as string;
      session.user.name = (token.name as string) ?? session.user.name;
      return session;
    },
  },
} satisfies NextAuthConfig;
