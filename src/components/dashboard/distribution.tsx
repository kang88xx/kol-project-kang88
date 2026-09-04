"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { TypeBadge, PlatformBadge } from "@/components/badges";
import { Segmented } from "@/components/segmented";
import { formatNumber, formatPercent } from "@/lib/format";
import type { ChannelStat } from "@/lib/metrics";

const MAX_SLICES = 8;
const SERIES = Array.from({ length: MAX_SLICES }, (_, i) => `var(--series-${i + 1})`);
const OTHER = "var(--series-other)";

type Metric = "posts" | "views";

type Slice = { name: string; value: number; share: number; color: string; isOther?: boolean };

function toSlices(channels: ChannelStat[], metric: Metric): Slice[] {
  const total = channels.reduce((s, c) => s + c[metric], 0) || 1;
  // Channels are ranked by views; color follows the channel's rank in that fixed order
  // so both donuts paint the same channel with the same hue.
  const head = channels.slice(0, MAX_SLICES).map((c, i) => ({ name: c.displayName, value: c[metric], share: c[metric] / total, color: SERIES[i] }));
  const tail = channels.slice(MAX_SLICES);
  if (tail.length) {
    const v = tail.reduce((s, c) => s + c[metric], 0);
    head.push({ name: `Other (${tail.length})`, value: v, share: v / total, color: OTHER, isOther: true } as Slice);
  }
  return head.filter((s) => s.value > 0);
}

function Donut({ title, slices, unit }: { title: string; slices: Slice[]; unit: string }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  return (
    <div className="flex flex-col items-center">
      <div className="mb-1 text-label-1 font-semibold text-label-neutral">{title}</div>
      <div className="relative h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={slices} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={1.5} stroke="var(--card)" strokeWidth={2} isAnimationActive={false}>
              {slices.map((s) => (
                <Cell key={s.name} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const s = payload[0].payload as Slice;
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 text-caption-1 shadow-md">
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <div className="text-muted-foreground">
                      {formatNumber(s.value)} {unit} · {formatPercent(s.share)}
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-heading-1 font-bold tabular-nums text-label-strong">{formatNumber(total)}</div>
          <div className="text-caption-2 uppercase text-muted-foreground">{unit}</div>
        </div>
      </div>
    </div>
  );
}

export function Distribution({ channels }: { channels: ChannelStat[] }) {
  const [metric, setMetric] = useState<Metric>("views");
  const postSlices = useMemo(() => toSlices(channels, "posts"), [channels]);
  const viewSlices = useMemo(() => toSlices(channels, "views"), [channels]);
  const ranked = useMemo(() => [...channels].sort((a, b) => b[metric] - a[metric]), [channels, metric]);
  const colorOf = (channelId: string) => {
    const idx = channels.findIndex((c) => c.channelId === channelId);
    return idx < MAX_SLICES ? SERIES[idx] : OTHER;
  };

  return (
    <section className="surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-heading-2 font-semibold text-label-strong">KOL Distribution</h2>
          <p className="mt-0.5 text-caption-1 text-muted-foreground">채널별 게시물·조회수 기여도. 색은 조회수 순위 기준으로 채널에 고정됩니다.</p>
        </div>
        <Segmented value={metric} onChange={setMetric} options={[["views", "By Views"], ["posts", "By Posts"]]} label="Rank by" />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr_1.4fr]">
        <Donut title="Post Distribution" slices={postSlices} unit="posts" />
        <Donut title="View Distribution" slices={viewSlices} unit="views" />
        <ol className="divide-y divide-border text-label-1">
          {ranked.map((c, i) => {
            const share = metric === "views" ? c.viewShare : c.postShare;
            return (
              <li key={c.channelId} className="flex items-center gap-3 py-2.5">
                <span className="w-5 text-right text-caption-1 tabular-nums text-label-assistive">{i + 1}</span>
                <span className="size-2.5 shrink-0 rounded-sm" style={{ background: colorOf(c.channelId) }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-foreground">{c.displayName}</span>
                    <TypeBadge type={c.type} />
                    <PlatformBadge platform={c.platform} className="hidden sm:inline-flex" />
                  </div>
                  <div className="truncate text-caption-1 text-muted-foreground">@{c.handle}</div>
                </div>
                <div className="text-right tabular-nums">
                  <div className="font-semibold text-foreground">{formatNumber(c[metric])}</div>
                  <div className="text-caption-1 text-muted-foreground">{formatPercent(share)}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
