"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export type ActionState = { error?: string; success?: string };

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const next = String(formData.get("next") ?? "");
  const redirectTo = next.startsWith("/") && !next.startsWith("//") ? next : "/projects";
  try {
    await signIn("credentials", {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo,
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
    }
    throw err;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "현재 비밀번호를 입력하세요."),
    next: z.string().min(6, "새 비밀번호는 6자 이상이어야 합니다."),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { message: "새 비밀번호가 일치하지 않습니다.", path: ["confirm"] });

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = passwordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." };

  const record = await prisma.user.findUnique({ where: { id: user.id } });
  if (!record) redirect("/login");
  const ok = await bcrypt.compare(parsed.data.current, record.passwordHash);
  if (!ok) return { error: "현재 비밀번호가 올바르지 않습니다." };

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 10) },
  });
  return { success: "비밀번호가 변경되었습니다." };
}
