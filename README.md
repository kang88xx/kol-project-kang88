# KOLpulse

크립토 KOL 캠페인 성과 리포팅 대시보드. 에이전시가 고객사에 캠페인 결과(게시물·조회수·반응)를
Assigned(유료 KOL) / Organic(자발 언급), Telegram / X 소스별로 나눠 보여준다.

## 실행

```bash
docker compose up -d          # PostgreSQL 16 (localhost:5433)
npm install
npx prisma migrate dev        # 스키마 적용 (+ 클라이언트 생성)
npx prisma db seed            # 데모 데이터
npm run dev                   # http://localhost:3000
```

`.env`는 `.env.example`을 복사해 만든다. 배포 시 `AUTH_SECRET`은 반드시 새 값으로 바꾼다.

## 데모 계정

| 역할 | 이메일 | 비밀번호 | 보이는 프로젝트 |
|---|---|---|---|
| ADMIN | admin@kolpulse.local | admin1234 | 전체 |
| VIEWER | viewer@kolpulse.local | viewer1234 | KGEN만 |

## 구조

- `prisma/schema.prisma` — Organization · User · ProjectAccess · Project · Kol · Channel · Assignment · Post · MetricSnapshot
- `src/lib/auth*.ts`, `src/proxy.ts` — Auth.js(이메일·비밀번호, JWT), 미로그인 리다이렉트
- `src/lib/projects.ts` — 역할·배정 기반 프로젝트 스코프
- `src/lib/metrics.ts` — 대시보드 집계(합계, 소스 분해, 채널 랭킹, 누적 시계열, 게시물 목록)
- `src/app/(app)/projects` — 프로젝트 목록, `[slug]` 대시보드
- `src/app/api/projects/[slug]/export` — CSV 내보내기
- `src/components/dashboard` — 요약 타일, 도넛/랭킹, 시계열 차트·표, 게시물 피드

## 스택

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui(Base UI) · Recharts · Prisma 7 · PostgreSQL · Auth.js v5
