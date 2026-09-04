import type { Metadata } from "next";
import { UplinkLogo } from "@/components/brand";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <UplinkLogo size="lg" />
          <div>
            <h1 className="text-heading-2 font-semibold text-label-strong">캠페인 리포트에 로그인</h1>
            <p className="mt-1 text-body-2 text-muted-foreground">KOL 성과를 한곳에서 확인하세요.</p>
          </div>
        </div>
        <div className="surface p-6 shadow-md">
          <LoginForm next={next} />
        </div>
        <p className="mt-5 text-center text-caption-1 text-label-assistive">
          배정된 프로젝트만 표시됩니다. 접근 권한은 운영자에게 문의하세요.
        </p>
      </div>
    </div>
  );
}
