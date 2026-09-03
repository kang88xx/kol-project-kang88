import { NextResponse, type NextRequest } from "next/server";
import { getDashboard } from "@/lib/metrics";
import { getProjectForUser } from "@/lib/projects";
import { getCurrentUser } from "@/lib/session";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await ctx.params;
  const project = await getProjectForUser(user, slug);
  if (!project) return NextResponse.json({ error: "not found" }, { status: 404 });

  const type = req.nextUrl.searchParams.get("type") ?? "ALL";
  const platform = req.nextUrl.searchParams.get("platform") ?? "ALL";

  const dash = await getDashboard(project.id, { periodStart: project.periodStart, periodEnd: project.periodEnd });
  const rows = dash.posts.filter((p) => (type === "ALL" || p.type === type) && (platform === "ALL" || p.platform === platform));

  const header = ["posted_at", "channel", "handle", "platform", "type", "views", "comments", "emojis", "retweets", "likes", "url", "content"];
  const lines = [header.join(",")];
  for (const p of rows) {
    lines.push(
      [p.postedAt, p.channelName, p.handle, p.platform, p.type, p.views, p.comments, p.emojis, p.retweets, p.likes, p.url, p.excerpt]
        .map(csvCell)
        .join(","),
    );
  }
  const body = "﻿" + lines.join("\n");
  const filename = `${project.slug}-posts-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
