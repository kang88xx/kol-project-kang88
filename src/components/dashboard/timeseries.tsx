"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Segmented } from "@/components/segmented";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompact, formatNumber, formatShortDate } from "@/lib/format";
import type { SeriesPoint } from "@/lib/metrics";

type Interval = "daily" | "weekly" | "monthly";
type View = "chart" | "table";

type Bucket = { label: string; start: string; end: string; cumulativeViews: number; deltaViews: number; posts: number };

function bucketKey(date: string, interval: Interval) {
  if (interval === "daily") return date;
  if (interval === "monthly") return date.slice(0, 7);
  const d = new Date(`${date}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - dow);
  return d.toISOString().slice(0, 10);
}

function aggregate(series: SeriesPoint[], interval: Interval): Bucket[] {
  const out: Bucket[] = [];
  for (const p of series) {
    const key = bucketKey(p.date, interval);
    const last = out[out.length - 1];
    if (last && last.start === key) {
      last.end = p.date;
      last.cumulativeViews = p.cumulativeViews;
      last.deltaViews += p.dailyViews;
      last.posts += p.posts;
    } else {
      out.push({ label: key, start: key, end: p.date, cumulativeViews: p.cumulativeViews, deltaViews: p.dailyViews, posts: p.posts });
    }
  }
  return out.map((b) => ({
    ...b,
    label: interval === "monthly" ? b.start : interval === "weekly" ? `${formatShortDate(b.start)} wk` : formatShortDate(b.start),
  }));
}

export function TimeSeries({ series }: { series: SeriesPoint[] }) {
  const [interval, setInterval] = useState<Interval>("daily");
  const [view, setView] = useState<View>("chart");
  const data = useMemo(() => aggregate(series, interval), [series, interval]);

  const first = data[0]?.cumulativeViews ?? 0;
  const last = data[data.length - 1]?.cumulativeViews ?? 0;

  return (
    <section className="surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-heading-2 font-semibold text-label-strong">View Changes Over Time</h2>
          <p className="mt-0.5 text-caption-1 text-muted-foreground">
            누적 조회수 · {data.length ? `${formatCompact(first)} → ${formatCompact(last)}` : "데이터 없음"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Segmented value={interval} onChange={setInterval} options={[["daily", "Daily"], ["weekly", "Weekly"], ["monthly", "Monthly"]]} label="Interval" />
          <Segmented value={view} onChange={setView} options={[["chart", "Chart"], ["table", "Table"]]} label="View" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-[var(--semantic-line-normal-neutral)] p-10 text-center text-body-2 text-muted-foreground">
          아직 수집된 지표가 없습니다.
        </div>
      ) : view === "chart" ? (
        <div className="mt-5 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border-solid)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} width={44} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickFormatter={(v) => formatCompact(v)} />
              <Tooltip
                cursor={{ stroke: "var(--semantic-interaction-inactive)", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const b = payload[0].payload as Bucket;
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-caption-1 shadow-md">
                      <div className="font-semibold text-foreground">{b.start === b.end ? b.start : `${b.start} – ${b.end}`}</div>
                      <div className="text-muted-foreground">누적 {formatNumber(b.cumulativeViews)} · 증가 +{formatNumber(b.deltaViews)}</div>
                      <div className="text-muted-foreground">게시물 {b.posts}</div>
                    </div>
                  );
                }}
              />
              <Area type="monotone" dataKey="cumulativeViews" stroke="var(--series-1)" strokeWidth={2} fill="url(#viewsFill)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-5 max-h-96 overflow-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Posts</TableHead>
                <TableHead className="text-right">Views (Δ)</TableHead>
                <TableHead className="text-right">Cumulative Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...data].reverse().map((b) => (
                <TableRow key={b.start}>
                  <TableCell className="font-medium">{b.start === b.end ? b.start : `${b.start} – ${b.end}`}</TableCell>
                  <TableCell className="text-right tabular-nums">{b.posts}</TableCell>
                  <TableCell className="text-right tabular-nums">+{formatNumber(b.deltaViews)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(b.cumulativeViews)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
