# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Drizzle schema directly to Supabase (dev workflow)
npm run db:generate  # Generate SQL migration files
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio GUI
```

No test framework is configured.

## Architecture

**AIknowsMe** (formerly GEO Tracker) is a Next.js App Router application that scans AI models (ChatGPT, Claude, Perplexity, Gemini) for brand mentions and computes a visibility score (0-100).

### Core scan flow

1. User submits brand name + queries via `POST /api/scans` (free) or `POST /api/brands/[brandId]/scans` (pro)
2. The API creates brand, queries, and scan records in Postgres, then triggers `runScan()` in the background using Next.js `after()`
3. `lib/ai/orchestrator.ts` fans out every query × model combination concurrently via `Promise.allSettled`
4. Each AI response is passed through `lib/ai/parser.ts` which detects mentions, citations, sentiment, rank position, and computes a per-result visibility score
5. The orchestrator computes a weighted overall score and marks the scan as completed

### Data layer

- **ORM**: Drizzle with `postgres` driver. Schema in `lib/db/schema.ts`, client in `lib/db/index.ts`
- **Database**: Supabase Postgres (requires `serverExternalPackages: ["postgres"]` in next.config)
- **Auth**: Supabase Auth via `@supabase/ssr`. Three client variants:
  - `lib/supabase/client.ts` — browser (client components)
  - `lib/supabase/server.ts` — server components/actions (uses cookies)
  - `lib/supabase/admin.ts` — service role for admin operations
- **Middleware** (`middleware.ts`): refreshes Supabase session, protects `/dashboard/*` routes, redirects authenticated users away from `/auth/*`

### AI model clients

Each model has its own client file under `lib/ai/` (openai.ts, anthropic.ts, perplexity.ts, gemini.ts). Model config (IDs, display names, weights, colors) lives in `lib/ai/models.ts`. Perplexity is weighted 1.2x; others 1.0x.

### Key patterns

- **Path alias**: `@/*` maps to project root
- **Free scans**: anonymous brands with 7-day expiry; rate limited to 3/day per IP via Upstash Redis (gracefully skipped if Upstash is not configured)
- **Pro scans**: weekly automated via Vercel Cron (`POST /api/cron/weekly-scans`, Monday 9 AM UTC), authenticated with `CRON_SECRET` bearer token
- **Stripe billing**: webhook handler at `/api/webhooks/stripe`, portal at `/api/billing/portal`, checkout at `/api/billing/create-checkout`
- **Score drop alerts**: sent via Resend when weekly scan score drops >10 points
- **Profiles table**: auto-created via Supabase SQL trigger on `auth.users` insert (not managed by app code)
- **Lead capture gate**: results page (`app/results/[scanId]/page.tsx`) gates completed scan results behind a Formspree form (`components/results/LeadCaptureGate.tsx`). Unlock state is persisted in `localStorage` key `aiknowsme_unlocked_{scanId}`.
- **Known build issue**: `npm run build` fails at page data collection for `/api/billing/create-checkout` when `STRIPE_SECRET_KEY` env var is missing. TypeScript compilation (`npx tsc --noEmit`) passes cleanly.

### Landing page

- `app/page.tsx` — marketing landing page with Hero, Problem, Solution, Differentiators, ICP, FAQ, and Final CTA sections
- `components/landing/ChatMockup.tsx` — server component rendering a mock AI chat with ranked results and green/red highlight annotations
- `components/landing/FAQ.tsx` — client component with single-open accordion (7 items)
- CSS classes `chat-highlight-green` / `chat-highlight-red` are defined in `app/globals.css`

### UI

- Tailwind CSS v4 with shadcn-style components in `components/ui/`
- Charts via Recharts
- Validation with Zod (scan form schema in `components/scan/scan-schema.ts`)
- Navbar links: "How it works" (`#solution`), "FAQ" (`#faq`), "Check Now" (`/scan`). Auth buttons removed for MVP.
