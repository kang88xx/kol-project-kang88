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
      <Link href="/projects" className="inline-flex items-center gap-1 text-label-1 font-medium text-label-neutral hover:text-foreground">
        <ChevronLeft className="size-4" /> My Projects
      </Link>

      <header className="surface flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-fill text-heading-2 font-bold uppercase text-label-neutral">
            {project.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-title-3 font-bold text-label-strong">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            {project.description && <p className="mt-0.5 text-body-2 text-label-neutral">{project.description}</p>}
            <p className="mt-1 text-caption-1 text-muted-foreground">
              {formatPeriod(project.periodStart, project.periodEnd)}
              {project.clientOrg && <> · {project.clientOrg.name}</>}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:flex md:gap-3">
          <SplitStat type="ASSIGNED" posts={assigned.posts} views={assigned.views} />
          <SplitStat type="ORGANIC" posts={organic.posts} views={organic.views} />
        </div>
      </header>

      <Summary totals={dash.totals} bySource={dash.bySource} />
      <Distribution channels={dash.channels} />
      <TimeSeries series={dash.series} />
      <PostsTable posts={dash.posts} exportHref={`/api/projects/${project.slug}/export`} />
    </div>
  );
}

function SplitStat({ type, posts, views }: { type: "ASSIGNED" | "ORGANIC"; posts: number; views: number }) {
  return (
    <div className="rounded-lg bg-[var(--semantic-background-normal-alternative)] px-4 py-3">
      <TypeBadge type={type} />
      <div className="mt-1.5 whitespace-nowrap text-label-1 tabular-nums text-label-neutral">
        <span className="font-semibold text-foreground">{posts}</span> posts · <span className="font-semibold text-foreground">{formatCompact(views)}</span> views
      </div>
    </div>
  );
}
