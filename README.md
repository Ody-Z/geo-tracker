# GEO Tracker

Track how your brand appears in AI-generated responses from ChatGPT, Claude, Perplexity, and Gemini.

GEO Tracker scans multiple AI models simultaneously, analyzes their responses for brand mentions, citations, sentiment, and ranking position, then computes a visibility score (0–100) so you can understand and improve your brand's presence in generative AI.

## Features

- **Multi-model scanning** — Query ChatGPT (GPT-4o-mini), Claude (Haiku), Perplexity (Sonar), and Gemini (Flash) in one click
- **Visibility scoring** — 0–100 score based on mentions, rank position, citations, domain links, and sentiment
- **Free scan** — No signup required, shareable results link (7-day retention)
- **Dashboard** — Track up to 5 brands with trend charts, model breakdowns, and query performance grids
- **Weekly automated scans** — Pro users get Monday morning scans via Vercel Cron
- **Score drop alerts** — Email notification when visibility drops >10 points
- **Shareable reports** — Every scan generates a unique URL with OG meta tags

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth + Database | Supabase (Postgres + Auth) |
| ORM | Drizzle ORM |
| AI Models | OpenAI, Anthropic, Perplexity, Google Gemini |
| Payments | Stripe |
| Email | Resend |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Rate Limiting | Upstash Redis |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- API keys for OpenAI, Anthropic, Perplexity, and Google Gemini

### Setup

1. Clone the repo:

```bash
git clone https://github.com/Ody-Z/geo-tracker.git
cd geo-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Copy the env template and fill in your keys:

```bash
cp .env.local.example .env.local
```

4. Push the database schema to Supabase:

```bash
npm run db:push
```

5. Create the `profiles` auto-creation trigger in the Supabase SQL editor:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

6. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx                    # Landing page
  scan/page.tsx               # Free scan form
  results/[scanId]/page.tsx   # Shareable results
  dashboard/                  # Protected brand management
  pricing/page.tsx            # Pricing page
  auth/                       # Login, signup, OAuth callback
  api/                        # Scans, brands, billing, cron, webhooks
components/
  ui/                         # Button, Card, Badge, Input, Skeleton
  layout/                     # Navbar, Footer, DashboardSidebar
  scan/                       # ScanForm, ScanProgress
  results/                    # ScoreGauge, ModelResultCard, Citations
  dashboard/                  # BrandCard, TrendChart, ModelBreakdown
  pricing/                    # PricingCard
lib/
  ai/                         # Model clients, orchestrator, parser
  db/                         # Drizzle schema and client
  supabase/                   # Browser, server, admin clients
  stripe.ts, resend.ts, ratelimit.ts, utils.ts
```

## Pricing

| | Free | Pro ($29/mo) |
|---|---|---|
| Brands | 1 one-time scan | Up to 5 |
| Queries per scan | 3 | 10 |
| AI models | All 4 | All 4 |
| Scans | One-time | Weekly auto + 4 manual/mo |
| History | 7-day link | 12 months |
| Charts & trends | — | Full dashboard |
| Email alerts | — | Score drop alerts |

## License

MIT
