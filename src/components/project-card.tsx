import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/badges";
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
    <Link
      href={`/projects/${project.slug}`}
      className="group surface flex flex-col justify-between p-5 outline-none transition-[box-shadow,border-color] hover:border-[var(--semantic-line-primary-normal)] hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/40"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-fill text-label-1 font-bold uppercase text-label-neutral">
              {project.name.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-headline-1 font-semibold text-label-strong">{project.name}</h2>
              {project.clientOrg && <p className="text-caption-1 text-muted-foreground">{project.clientOrg.name}</p>}
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>
        {project.description && <p className="mt-3 line-clamp-2 text-body-2 text-label-neutral">{project.description}</p>}
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="text-caption-1 text-muted-foreground">
          <div>{formatPeriod(project.periodStart, project.periodEnd)}</div>
          <div className="mt-0.5 tabular-nums">
            채널 {project._count.assignments} · 게시물 {project._count.posts}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-label-1 font-semibold text-primary">
          View <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
