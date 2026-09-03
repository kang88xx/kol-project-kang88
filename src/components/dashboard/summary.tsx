"use client";

import { useState } from "react";
import { StatTile } from "@/components/dashboard/stat-tile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import type { Platform, SourceRow, Totals } from "@/lib/metrics";
import { cn } from "@/lib/utils";

type SourceKey = "ALL" | Platform;
const LABEL: Record<SourceKey, string> = { ALL: "All", TELEGRAM: "Telegram", X: "X" };

export function Summary({ totals, bySource }: { totals: Totals; bySource: SourceRow[] }) {
  const [source, setSource] = useState<SourceKey>("ALL");
  const [showTable, setShowTable] = useState(false);
  const active: Totals = source === "ALL" ? totals : (bySource.find((s) => s.platform === source) ?? { posts: 0, views: 0, comments: 0, emojis: 0, retweets: 0 });
  const keys: SourceKey[] = ["ALL", ...bySource.map((s) => s.platform)];

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg border bg-muted/50 p-0.5 text-sm" role="tablist" aria-label="Source">
          {keys.map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={source === k}
              onClick={() => setSource(k)}
              className={cn(
                "rounded-md px-3 py-1 transition-colors",
                source === k ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {LABEL[k]}
            </button>
          ))}
        </div>
        <button onClick={() => setShowTable((v) => !v)} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          {showTable ? "Source 표 숨기기" : "Source 표 보기"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Total Posts" value={active.posts} />
        <StatTile label="Total Views" value={active.views} />
        <StatTile label="Comments" value={active.comments} />
        <StatTile label="Emojis" value={active.emojis} />
        <StatTile label="Retweets" value={active.retweets} />
      </div>

      {showTable && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Posts</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Comments</TableHead>
                <TableHead className="text-right">Emojis</TableHead>
                <TableHead className="text-right">Retweets</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bySource.map((s) => (
                <TableRow key={s.platform}>
                  <TableCell className="font-medium">{LABEL[s.platform]}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(s.posts)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(s.views)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(s.comments)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(s.emojis)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(s.retweets)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/40 font-medium">
                <TableCell>Total</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(totals.posts)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(totals.views)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(totals.comments)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(totals.emojis)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(totals.retweets)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
