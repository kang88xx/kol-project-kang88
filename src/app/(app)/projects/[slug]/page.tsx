import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { StatusBadge, TypeBadge } from "@/components/badges";
import { Distribution } from "@/components/dashboard/distribution";
import { PostsTable } from "@/components/dashboard/posts-table";
import { Summary } from "@/components/dashboard/summary";
import { TimeSeries } from "@/components/dashboard/timeseries";
import { formatCompact, formatPeriod } from "@/lib/format";
import { getDashboard } from "@/lib/metrics";
import { getProjectForUser } from "@/lib/projects";
import { requireUser } from "@/lib/session";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.toUpperCase() };
}

export default async function ProjectDashboardPage({ params }: Props) {
  const user = await requireUser();
  const { slug } = await params;
  const project = await getProjectForUser(user, slug);
  if (!project) notFound();

  const dash = await getDashboard(project.id, { periodStart: project.periodStart, periodEnd: project.periodEnd });
  const assigned = dash.byType.find((t) => t.type === "ASSIGNED")!.totals;
  const organic = dash.byType.find((t) => t.type === "ORGANIC")!.totals;

  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> My Projects
      </Link>

      <header className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-muted text-lg font-bold uppercase text-muted-foreground">
            {project.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{project.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatPeriod(project.periodStart, project.periodEnd)}
              {project.clientOrg && <> · {project.clientOrg.name}</>}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-4">
          <div className="flex items-center gap-2">
            <TypeBadge type="ASSIGNED" />
            <span className="whitespace-nowrap tabular-nums">{assigned.posts} posts · {formatCompact(assigned.views)} views</span>
          </div>
          <div className="flex items-center gap-2">
            <TypeBadge type="ORGANIC" />
            <span className="whitespace-nowrap tabular-nums">{organic.posts} posts · {formatCompact(organic.views)} views</span>
          </div>
        </div>
      </header>

      <Summary totals={dash.totals} bySource={dash.bySource} />
      <Distribution channels={dash.channels} />
      <TimeSeries series={dash.series} />
      <PostsTable posts={dash.posts} exportHref={`/api/projects/${project.slug}/export`} />
    </div>
  );
}
