import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="size-5" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight">kk.agency</h1>
          <p className="text-sm text-muted-foreground">KOL 캠페인 성과 리포트에 로그인하세요.</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <LoginForm next={next} />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          배정된 프로젝트만 표시됩니다. 접근 권한은 운영자에게 문의하세요.
        </p>
      </div>
    </div>
  );
}
