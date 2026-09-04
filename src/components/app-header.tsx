import Link from "next/link";
import { UplinkLogo } from "@/components/brand";
import { AccountMenu } from "@/components/account-menu";
import type { SessionUser } from "@/lib/session";

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border-solid bg-elevated/90 backdrop-blur">
      <div className="mx-auto flex h-(--gnb-height) w-full max-w-6xl items-center justify-between px-5 sm:px-10">
        <div className="flex items-center gap-8">
          <Link href="/projects" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <UplinkLogo size="sm" />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/projects"
              className="rounded-md px-3 py-1.5 text-label-1 font-semibold text-label-neutral transition-colors hover:bg-fill hover:text-foreground"
            >
              My Projects
            </Link>
          </nav>
        </div>
        <AccountMenu name={user.name} username={user.username} role={user.role} />
      </div>
    </header>
  );
}
