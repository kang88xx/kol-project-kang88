import Link from "next/link";
import { Activity } from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import type { SessionUser } from "@/lib/session";

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/projects" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="size-4" />
            </span>
            kk.agency
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
            <Link href="/projects" className="hover:text-foreground">My Projects</Link>
          </nav>
        </div>
        <AccountMenu name={user.name} username={user.username} role={user.role} />
      </div>
    </header>
  );
}
