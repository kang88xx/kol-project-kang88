import { prisma } from "@/lib/prisma";
import { toISODate } from "@/lib/format";

export type Platform = "TELEGRAM" | "X";
export type AssignmentType = "ASSIGNED" | "ORGANIC";

export type Totals = { posts: number; views: number; comments: number; emojis: number; retweets: number };

export type SourceRow = Totals & { platform: Platform };

export type ChannelStat = {
  channelId: string;
  displayName: string;
  handle: string;
  platform: Platform;
  type: AssignmentType;
  posts: number;
  views: number;
  postShare: number;
  viewShare: number;
};

export type SeriesPoint = { date: string; cumulativeViews: number; dailyViews: number; posts: number };

export type PostRow = {
  id: string;
  postedAt: string;
  url: string | null;
  excerpt: string | null;
  channelId: string;
  channelName: string;
  handle: string;
  platform: Platform;
  type: AssignmentType;
  views: number;
  comments: number;
  emojis: number;
  retweets: number;
  likes: number;
};

export type Dashboard = {
  totals: Totals;
  bySource: SourceRow[];
  byType: { type: AssignmentType; totals: Totals }[];
  channels: ChannelStat[];
  series: SeriesPoint[];
  posts: PostRow[];
};

const emptyTotals = (): Totals => ({ posts: 0, views: 0, comments: 0, emojis: 0, retweets: 0 });

function add(t: Totals, p: { views: number; comments: number; emojis: number; retweets: number }) {
  t.posts += 1;
  t.views += p.views;
  t.comments += p.comments;
  t.emojis += p.emojis;
  t.retweets += p.retweets;
}

export async function getDashboard(projectId: string, opts: { periodStart: Date; periodEnd: Date | null }): Promise<Dashboard> {
  const [assignments, posts] = await Promise.all([
    prisma.assignment.findMany({ where: { projectId }, select: { channelId: true, type: true } }),
    prisma.post.findMany({
      where: { projectId },
      orderBy: { postedAt: "desc" },
      include: {
        channel: { select: { id: true, displayName: true, handle: true, platform: true } },
        snapshots: { orderBy: { capturedAt: "asc" }, select: { capturedAt: true, views: true } },
      },
    }),
  ]);

  const typeByChannel = new Map<string, AssignmentType>(assignments.map((a) => [a.channelId, a.type]));
  const typeOf = (channelId: string): AssignmentType => typeByChannel.get(channelId) ?? "ORGANIC";

  const totals = emptyTotals();
  const bySource = new Map<Platform, Totals>();
  const byType = new Map<AssignmentType, Totals>([
    ["ASSIGNED", emptyTotals()],
    ["ORGANIC", emptyTotals()],
  ]);
  const channelMap = new Map<string, ChannelStat>();

  for (const p of posts) {
    add(totals, p);
    const src = bySource.get(p.channel.platform) ?? emptyTotals();
    add(src, p);
    bySource.set(p.channel.platform, src);
    add(byType.get(typeOf(p.channelId))!, p);

    const c = channelMap.get(p.channelId) ?? {
      channelId: p.channelId,
      displayName: p.channel.displayName,
      handle: p.channel.handle,
      platform: p.channel.platform,
      type: typeOf(p.channelId),
      posts: 0,
      views: 0,
      postShare: 0,
      viewShare: 0,
    };
    c.posts += 1;
    c.views += p.views;
    channelMap.set(p.channelId, c);
  }

  const channels = [...channelMap.values()]
    .map((c) => ({
      ...c,
      postShare: totals.posts ? c.posts / totals.posts : 0,
      viewShare: totals.views ? c.views / totals.views : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const platformOrder: Platform[] = ["TELEGRAM", "X"];
  const sourceRows: SourceRow[] = platformOrder
    .filter((pl) => bySource.has(pl))
    .map((pl) => ({ platform: pl, ...bySource.get(pl)! }));

  return {
    totals,
    bySource: sourceRows,
    byType: [...byType.entries()].map(([type, t]) => ({ type, totals: t })),
    channels,
    series: buildSeries(posts, opts),
    posts: posts.map((p) => ({
      id: p.id,
      postedAt: p.postedAt.toISOString(),
      url: p.url,
      excerpt: p.contentExcerpt,
      channelId: p.channelId,
      channelName: p.channel.displayName,
      handle: p.channel.handle,
      platform: p.channel.platform,
      type: typeOf(p.channelId),
      views: p.views,
      comments: p.comments,
      emojis: p.emojis,
      retweets: p.retweets,
      likes: p.likes,
    })),
  };
}

type PostWithSnapshots = {
  postedAt: Date;
  views: number;
  snapshots: { capturedAt: Date; views: number }[];
};

// Daily cumulative views: for each day, sum the latest snapshot at or before
// the end of that day across all posts. Snapshots are the source of truth for
// history; a post with no snapshots contributes its current value from its post date.
function buildSeries(posts: PostWithSnapshots[], opts: { periodStart: Date; periodEnd: Date | null }): SeriesPoint[] {
  if (posts.length === 0) return [];

  const dayMs = 86_400_000;
  const startOfDay = (d: Date) => Math.floor(d.getTime() / dayMs) * dayMs;

  const firstPost = Math.min(...posts.map((p) => p.postedAt.getTime()));
  const start = startOfDay(new Date(Math.min(opts.periodStart.getTime(), firstPost)));

  const lastActivity = Math.max(
    ...posts.map((p) => (p.snapshots.length ? p.snapshots[p.snapshots.length - 1].capturedAt.getTime() : p.postedAt.getTime())),
  );
  const today = startOfDay(new Date());
  const endCandidates = [today, lastActivity];
  if (opts.periodEnd) endCandidates.push(opts.periodEnd.getTime());
  const end = startOfDay(new Date(Math.min(today, Math.max(lastActivity, Math.min(...endCandidates)))));

  const days = Math.max(1, Math.round((end - start) / dayMs) + 1);
  const cumulative = new Array<number>(days).fill(0);
  const postCounts = new Array<number>(days).fill(0);

  for (const p of posts) {
    const postDay = Math.floor((startOfDay(p.postedAt) - start) / dayMs);
    if (postDay >= 0 && postDay < days) postCounts[postDay] += 1;

    const steps = p.snapshots.length
      ? p.snapshots.map((s) => ({ day: Math.floor((startOfDay(s.capturedAt) - start) / dayMs), views: s.views }))
      : [{ day: postDay, views: p.views }];

    let idx = 0;
    let current = 0;
    for (let d = 0; d < days; d++) {
      while (idx < steps.length && steps[idx].day <= d) {
        current = steps[idx].views;
        idx += 1;
      }
      cumulative[d] += current;
    }
  }

  return cumulative.map((v, i) => ({
    date: toISODate(new Date(start + i * dayMs)),
    cumulativeViews: v,
    dailyViews: i === 0 ? v : v - cumulative[i - 1],
    posts: postCounts[i],
  }));
}
