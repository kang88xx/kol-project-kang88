import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type SessionUser = { id: string; email: string; name: string; role: "ADMIN" | "VIEWER" };

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  const u = session?.user;
  if (!u?.id || !u.email) return null;
  return { id: u.id, email: u.email, name: u.name ?? u.email, role: u.role };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/projects");
  return user;
}
