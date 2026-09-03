import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/project-card";
import { listProjectsForUser } from "@/lib/projects";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "My Projects" };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const user = await requireUser();
  const { q = "", page: pageParam } = await searchParams;
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  const { projects, total, pageCount } = await listProjectsForUser(user, { q, page });

  const pageHref = (p: number) => `/projects?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.role === "ADMIN" ? "모든 프로젝트를 볼 수 있습니다." : "배정된 프로젝트만 표시됩니다."} 총 {total}개
          </p>
        </div>
        <form className="flex w-full gap-2 sm:w-auto" action="/projects">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="이름 또는 설명 검색" className="pl-8" />
          </div>
          <Button type="submit" variant="secondary">검색</Button>
        </form>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          {q ? `"${q}"에 해당하는 프로젝트가 없습니다.` : "표시할 프로젝트가 없습니다."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} nativeButton={false} render={<Link href={pageHref(Math.max(1, page - 1))} />}>
            Prev
          </Button>
          <span className="px-2 text-muted-foreground">{page} / {pageCount}</span>
          <Button variant="outline" size="sm" disabled={page >= pageCount} nativeButton={false} render={<Link href={pageHref(Math.min(pageCount, page + 1))} />}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
