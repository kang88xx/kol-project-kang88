import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Deterministic PRNG so the demo data is stable between reseeds.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260903);
const between = (min: number, max: number) => min + rand() * (max - min);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

const NOW = new Date("2026-09-03T00:00:00Z");
const day = (d: string) => new Date(`${d}T00:00:00Z`);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

type ChannelSeed = {
  displayName: string;
  handle: string;
  platform: "TELEGRAM" | "X";
  type: "ASSIGNED" | "ORGANIC";
  posts: number;
  avgViews: number;
  cost?: number;
};

const KGEN_CHANNELS: ChannelSeed[] = [
  { displayName: "불개미", handle: "bulgaemi_crypto", platform: "TELEGRAM", type: "ASSIGNED", posts: 22, avgViews: 1800, cost: 6_000_000 },
  { displayName: "코백남", handle: "cobacknam", platform: "TELEGRAM", type: "ASSIGNED", posts: 14, avgViews: 520, cost: 2_500_000 },
  { displayName: "청년열정마라", handle: "youth_mara", platform: "TELEGRAM", type: "ASSIGNED", posts: 10, avgViews: 510, cost: 1_800_000 },
  { displayName: "페지즙기 연구소", handle: "pejizeup_lab", platform: "TELEGRAM", type: "ASSIGNED", posts: 9, avgViews: 550, cost: 1_800_000 },
  { displayName: "젠티", handle: "zenti_crypto", platform: "TELEGRAM", type: "ASSIGNED", posts: 8, avgViews: 600, cost: 1_500_000 },
  { displayName: "험블맨", handle: "humbleman_kr", platform: "TELEGRAM", type: "ASSIGNED", posts: 8, avgViews: 510, cost: 1_500_000 },
  { displayName: "KGEN Korea", handle: "kgen_kr", platform: "X", type: "ASSIGNED", posts: 1, avgViews: 2300, cost: 0 },
  { displayName: "CoinHanna", handle: "coinhanna", platform: "TELEGRAM", type: "ORGANIC", posts: 5, avgViews: 230 },
  { displayName: "ChaeWoni", handle: "chaewoni_talk", platform: "TELEGRAM", type: "ORGANIC", posts: 4, avgViews: 190 },
  { displayName: "크립토모아", handle: "cryptomoa", platform: "TELEGRAM", type: "ORGANIC", posts: 4, avgViews: 260 },
];

const NEXA_CHANNELS: ChannelSeed[] = [
  { displayName: "불개미", handle: "bulgaemi_crypto", platform: "TELEGRAM", type: "ASSIGNED", posts: 6, avgViews: 1500, cost: 2_000_000 },
  { displayName: "젠티", handle: "zenti_crypto", platform: "TELEGRAM", type: "ASSIGNED", posts: 5, avgViews: 480, cost: 900_000 },
  { displayName: "크립토모아", handle: "cryptomoa", platform: "TELEGRAM", type: "ORGANIC", posts: 3, avgViews: 240 },
];

const EXCERPTS = [
  "{P} 메인넷 업데이트 정리. 이번 주 스테이킹 APR 변동 체크하세요.",
  "{P} 에어드랍 2차 스냅샷 일정 공개 — 지갑 연결 미리 해두세요.",
  "오늘 {P} AMA 요약: 토크노믹스 변경 없음, 상장 일정은 Q4.",
  "{P} 파트너십 발표. 온체인 거래량 3일 연속 증가 중.",
  "{P} 커뮤니티 이벤트 — 참여 방법과 보상 구조 정리해봤습니다.",
  "{P} 차트 브리핑: 주요 지지선 확인, 거래량 동반 여부가 관건.",
  "{P} 팀 인터뷰 핵심 문장 5개만 뽑았습니다.",
  "{P} 거버넌스 제안 #12 투표 시작. 찬반 포인트 정리.",
];

async function seedProject(opts: {
  name: string;
  slug: string;
  description: string;
  clientOrgId: string;
  periodStart: string;
  periodEnd: string | null;
  status: "DRAFT" | "ACTIVE" | "ENDED";
  keywords: string[];
  channels: ChannelSeed[];
  postWindow: [string, string];
}) {
  const project = await prisma.project.create({
    data: {
      name: opts.name,
      slug: opts.slug,
      description: opts.description,
      clientOrgId: opts.clientOrgId,
      periodStart: day(opts.periodStart),
      periodEnd: opts.periodEnd ? day(opts.periodEnd) : null,
      status: opts.status,
      keywords: opts.keywords,
    },
  });

  const [winStart, winEnd] = opts.postWindow.map(day);
  const windowDays = Math.round((winEnd.getTime() - winStart.getTime()) / 86_400_000);
  let postCounter = 0;

  for (const c of opts.channels) {
    const channel = await prisma.channel.upsert({
      where: { platform_handle: { platform: c.platform, handle: c.handle } },
      update: {},
      create: { displayName: c.displayName, platform: c.platform, handle: c.handle },
    });

    await prisma.assignment.create({
      data: {
        projectId: project.id,
        channelId: channel.id,
        type: c.type,
        cost: c.cost ?? null,
        currency: c.cost != null ? "KRW" : null,
      },
    });

    for (let i = 0; i < c.posts; i++) {
      postCounter += 1;
      const postedAt = addDays(winStart, Math.floor(between(0, windowDays)));
      postedAt.setUTCHours(Math.floor(between(8, 23)), Math.floor(between(0, 59)));

      const finalViews = Math.round(c.avgViews * between(0.55, 1.6));
      const isX = c.platform === "X";
      const finalComments = isX ? 2 : Math.round(finalViews * between(0.0012, 0.0035));
      const finalEmojis = isX ? 5 : Math.round(finalViews * between(0.002, 0.005));
      const finalRetweets = isX ? 0 : Math.round(finalViews * between(0.003, 0.009));
      const finalLikes = isX ? 41 : 0;

      const externalId = `${opts.slug}-${c.handle}-${postCounter}`;
      const url = isX
        ? `https://x.com/${c.handle}/status/18${String(postCounter).padStart(8, "0")}`
        : `https://t.me/${c.handle}/${1000 + postCounter}`;

      const post = await prisma.post.create({
        data: {
          projectId: project.id,
          channelId: channel.id,
          externalId,
          url,
          postedAt,
          contentExcerpt: pick(EXCERPTS).replace(/\{P\}/g, opts.name),
        },
      });

      // Growth curve: fraction of final metrics reached N days after posting.
      const curve: [number, number][] = [
        [1, 0.55],
        [3, 0.75],
        [7, 0.9],
        [14, 0.97],
        [30, 1],
      ];
      let latest: { views: number; comments: number; emojis: number; retweets: number; likes: number; at: Date } | null = null;
      for (const [offset, frac] of curve) {
        const capturedAt = addDays(postedAt, offset);
        if (capturedAt > NOW) break;
        latest = {
          views: Math.round(finalViews * frac),
          comments: Math.round(finalComments * frac),
          emojis: Math.round(finalEmojis * frac),
          retweets: Math.round(finalRetweets * frac),
          likes: Math.round(finalLikes * frac),
          at: capturedAt,
        };
        await prisma.metricSnapshot.create({
          data: {
            postId: post.id,
            capturedAt,
            views: latest.views,
            comments: latest.comments,
            emojis: latest.emojis,
            retweets: latest.retweets,
            likes: latest.likes,
          },
        });
      }
      if (latest) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            views: latest.views,
            comments: latest.comments,
            emojis: latest.emojis,
            retweets: latest.retweets,
            likes: latest.likes,
            metricsUpdatedAt: latest.at,
          },
        });
      }
    }
  }
  return project;
}

async function main() {
  await prisma.metricSnapshot.deleteMany();
  await prisma.post.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.projectAccess.deleteMany();
  await prisma.project.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.kol.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const agency = await prisma.organization.create({ data: { name: "kk.agency" } });
  const kgenOrg = await prisma.organization.create({ data: { name: "KGEN Labs" } });
  const nexaOrg = await prisma.organization.create({ data: { name: "Nexa Foundation" } });

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@kk.agency",
      name: "운영자",
      role: "ADMIN",
      orgId: agency.id,
      passwordHash: await bcrypt.hash("qwe123", 10),
    },
  });
  const viewer = await prisma.user.create({
    data: {
      username: "kayla",
      email: "kayla@kk.agency",
      name: "Kayla",
      role: "VIEWER",
      orgId: kgenOrg.id,
      passwordHash: await bcrypt.hash("qwe123", 10),
    },
  });

  const kgen = await seedProject({
    name: "KGEN",
    slug: "kgen",
    description: "KGEN (Jul~Aug) Assigned + Organic 캠페인",
    clientOrgId: kgenOrg.id,
    periodStart: "2026-07-27",
    periodEnd: "2026-12-31",
    status: "ACTIVE",
    keywords: ["KGEN", "$KGEN", "케이젠"],
    channels: KGEN_CHANNELS,
    postWindow: ["2026-07-27", "2026-08-30"],
  });

  await seedProject({
    name: "Nexa Chain TGE",
    slug: "nexa-tge",
    description: "Nexa Chain 토큰 생성 이벤트 런칭 캠페인",
    clientOrgId: nexaOrg.id,
    periodStart: "2026-05-01",
    periodEnd: "2026-06-15",
    status: "ENDED",
    keywords: ["Nexa", "$NEXA"],
    channels: NEXA_CHANNELS,
    postWindow: ["2026-05-01", "2026-06-10"],
  });

  await prisma.project.create({
    data: {
      name: "Orbit Wallet Launch",
      slug: "orbit-wallet",
      description: "Orbit 지갑 출시 캠페인 (준비 중)",
      clientOrgId: nexaOrg.id,
      periodStart: day("2026-09-15"),
      periodEnd: day("2026-10-31"),
      status: "DRAFT",
      keywords: ["Orbit", "OrbitWallet"],
    },
  });

  await prisma.projectAccess.create({ data: { userId: viewer.id, projectId: kgen.id } });

  const totals = await prisma.post.aggregate({
    where: { projectId: kgen.id },
    _count: true,
    _sum: { views: true, comments: true, emojis: true, retweets: true },
  });
  console.log("Seeded. admin:", admin.username, "viewer:", viewer.username);
  console.log("KGEN totals:", totals._count, totals._sum);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
