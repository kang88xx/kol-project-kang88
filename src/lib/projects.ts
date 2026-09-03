import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { SessionUser } from "@/lib/session";

export const PAGE_SIZE = 6;

function scopeFor(user: SessionUser): Prisma.ProjectWhereInput {
  return user.role === "ADMIN" ? {} : { access: { some: { userId: user.id } } };
}

export async function listProjectsForUser(user: SessionUser, opts: { q?: string; page?: number }) {
  const page = Math.max(1, opts.page ?? 1);
  const q = opts.q?.trim();
  const where: Prisma.ProjectWhereInput = {
    AND: [
      scopeFor(user),
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: [{ status: "asc" }, { periodStart: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        clientOrg: { select: { name: true } },
        _count: { select: { posts: true, assignments: true } },
      },
    }),
  ]);

  return { projects, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProjectForUser(user: SessionUser, slug: string) {
  return prisma.project.findFirst({
    where: { AND: [scopeFor(user), { slug }] },
    include: { clientOrg: { select: { name: true } } },
  });
}
