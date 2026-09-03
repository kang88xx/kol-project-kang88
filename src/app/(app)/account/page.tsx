import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/change-password-form";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "계정" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">계정</h1>
        <p className="mt-1 text-sm text-muted-foreground">@{user.username} · {user.role}</p>
      </div>
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">비밀번호 변경</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
