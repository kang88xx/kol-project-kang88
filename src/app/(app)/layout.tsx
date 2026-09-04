import { AppHeader } from "@/components/app-header";
import { requireUser } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-10 sm:py-10">{children}</main>
      <footer className="border-t border-border-solid py-5 text-center text-caption-1 text-label-assistive">
        Uplink · KOL campaign reporting
      </footer>
    </div>
  );
}
