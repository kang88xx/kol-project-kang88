import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { formatPeriod } from "@/lib/format";

export type ProjectCardData = {
  slug: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "ENDED";
  periodStart: Date;
  periodEnd: Date | null;
  clientOrg: { name: string } | null;
  _count: { posts: number; assignments: number };
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-foreground/20">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-sm font-bold uppercase text-muted-foreground">
              {project.name.slice(0, 2)}
            </div>
            <div>
              <h2 className="font-semibold leading-tight">{project.name}</h2>
              {project.clientOrg && <p className="text-xs text-muted-foreground">{project.clientOrg.name}</p>}
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>
        {project.description && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          <div>{formatPeriod(project.periodStart, project.periodEnd)}</div>
          <div className="mt-0.5">
            채널 {project._count.assignments} · 게시물 {project._count.posts}
          </div>
        </div>
        <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/projects/${project.slug}`} />}>
          View <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
