"use client";

import { useMemo, useState } from "react";
import { Download, ExternalLink, Heart, MessageCircle, Repeat2, SmilePlus } from "lucide-react";
import { PlatformBadge, TypeBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { AssignmentType, Platform, PostRow } from "@/lib/metrics";
import { cn } from "@/lib/utils";

type TypeFilter = "ALL" | AssignmentType;
type PlatformFilter = "ALL" | Platform;
const PAGE = 20;

export function PostsTable({ posts, exportHref }: { posts: PostRow[]; exportHref: string }) {
  const [type, setType] = useState<TypeFilter>("ALL");
  const [platform, setPlatform] = useState<PlatformFilter>("ALL");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(
    () => posts.filter((p) => (type === "ALL" || p.type === type) && (platform === "ALL" || p.platform === platform)),
    [posts, type, platform],
  );
  const visible = filtered.slice(0, limit);
  const csvHref = `${exportHref}?${new URLSearchParams({ type, platform })}`;

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Recent Posts</h2>
          <p className="text-xs text-muted-foreground">{formatNumber(filtered.length)}건 · 최신순</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter value={type} onChange={(v) => { setType(v); setLimit(PAGE); }} options={[["ALL", "All"], ["ASSIGNED", "Assigned"], ["ORGANIC", "Organic"]]} />
          <Filter value={platform} onChange={(v) => { setPlatform(v); setLimit(PAGE); }} options={[["ALL", "All"], ["TELEGRAM", "Telegram"], ["X", "X"]]} />
          <Button variant="outline" size="sm" nativeButton={false} render={<a href={csvHref} />}>
            <Download className="size-3.5" /> CSV
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Date</TableHead>
              <TableHead className="w-48">Channel</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Reactions</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">조건에 맞는 게시물이 없습니다.</TableCell>
              </TableRow>
            )}
            {visible.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(p.postedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-medium">{p.channelName}</span>
                    <PlatformBadge platform={p.platform} />
                  </div>
                  <div className="mt-0.5">
                    <TypeBadge type={p.type} />
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2 text-sm">{p.excerpt ?? <span className="text-muted-foreground">(본문 없음)</span>}</p>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatNumber(p.views)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3 text-xs tabular-nums text-muted-foreground">
                    <span className="inline-flex items-center gap-1" title="Comments"><MessageCircle className="size-3.5" />{p.comments}</span>
                    <span className="inline-flex items-center gap-1" title="Emojis"><SmilePlus className="size-3.5" />{p.emojis}</span>
                    {p.platform === "X" ? (
                      <span className="inline-flex items-center gap-1" title="Likes"><Heart className="size-3.5" />{p.likes}</span>
                    ) : null}
                    <span className="inline-flex items-center gap-1" title="Retweets / Forwards"><Repeat2 className="size-3.5" />{p.retweets}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" title="원문 열기">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filtered.length > visible.length && (
        <div className="mt-3 text-center">
          <Button variant="ghost" size="sm" onClick={() => setLimit((l) => l + PAGE)}>
            더 보기 ({filtered.length - visible.length}건 남음)
          </Button>
        </div>
      )}
    </section>
  );
}

function Filter<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="inline-flex rounded-lg border bg-muted/50 p-0.5 text-sm" role="tablist">
      {options.map(([v, label]) => (
        <button
          key={v}
          role="tab"
          aria-selected={value === v}
          onClick={() => onChange(v)}
          className={cn("rounded-md px-2.5 py-1", value === v ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
