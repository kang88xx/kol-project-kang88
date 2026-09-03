import type { DefaultSession } from "next-auth";

type Role = "ADMIN" | "VIEWER";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role; username: string } & DefaultSession["user"];
  }
  interface User {
    role: Role;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    username?: string;
  }
}
