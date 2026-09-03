import { AppHeader } from "@/components/app-header";
import { requireUser } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">kk.agency · KOL campaign reporting</footer>
    </div>
  );
}
