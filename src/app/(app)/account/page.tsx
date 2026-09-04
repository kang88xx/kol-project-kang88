import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/change-password-form";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "계정" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-title-2 font-bold text-label-strong">계정</h1>
        <p className="mt-1 text-body-2 text-muted-foreground">@{user.username} · {user.role}</p>
      </div>
      <section className="surface p-6">
        <h2 className="mb-5 text-heading-2 font-semibold text-label-strong">비밀번호 변경</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
