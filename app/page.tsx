import { ChatMockup } from "@/components/landing/ChatMockup";
import { HeroScanForm } from "@/components/landing/HeroScanForm";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { FAQ } from "@/components/landing/FAQ";

export default function HomePage() {
  return (
    <div>
      {/* ── Hero (full viewport) ── */}
      <section className="bg-card min-h-[calc(100vh-64px)] flex items-center border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
          <div className="mx-auto max-w-[720px] text-center">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border bg-background px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-score-high animate-pulse-dot" />
              AI Visibility Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.08] mb-4">
              Understand how AI
              <br />
              sees you.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-[540px] mx-auto mb-8">
              Track how ChatGPT, Claude, Gemini, and Perplexity represent you
              &mdash; and what to fix next. For professionals, founders, and
              personal brands.
            </p>

            <HeroScanForm />
          </div>

          {/* Scroll down indicator */}
          <div className="mt-12 flex flex-col items-center gap-1 text-muted-foreground/50 animate-bounce">
            <span className="text-xs tracking-wide">Scroll down</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
              <path d="M4 6l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Visual: feature cards + chat mockup ── */}
      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="grid md:grid-cols-[.4fr_.6fr] gap-0 max-w-[960px] mx-auto overflow-hidden">
            {/* Feature cards */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-visible md:pr-5 pb-5 md:pb-0 gap-0">
              {[
                {
                  title: "Visibility",
                  text: "See the share of chats where your brand is mentioned and understand how often you show up in conversations.",
                  active: true,
                },
                {
                  title: "Position",
                  text: "Understand your brand\u2019s position within AI search results and uncover opportunities to improve your ranking.",
                  active: false,
                },
                {
                  title: "Sentiment",
                  text: "Find out how your brand is perceived by AI, what\u2019s going well, and what requires improvements.",
                  active: false,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`flex-1 min-w-[220px] py-7 px-6 border-b-[3px] md:border-b-0 md:border-l-[3px] flex flex-col justify-center transition-colors ${
                    card.active
                      ? "border-foreground"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat mockup */}
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="max-w-[640px] mb-12">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              The Real Problem
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">
              You don&apos;t need another vanity dashboard.
            </h2>
            <p className="text-muted-foreground">
              You need three clear decision outcomes.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                num: "01",
                text: "Know exactly where AI cites you \u2014 and where you\u2019re invisible.",
              },
              {
                num: "02",
                text: "See the competitor authority gap: who AI ranks above you and why.",
              },
              {
                num: "03",
                text: "Get weekly priority actions tied to your specific gaps.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="rounded-2xl border bg-background p-7 hover:shadow-md transition-shadow"
              >
                <span className="text-xs font-bold text-muted-foreground tracking-wide mb-3 block">
                  {item.num}
                </span>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-l-[3px] border-foreground rounded-r-xl bg-background px-6 py-5 text-sm text-muted-foreground">
            Most professionals are stuck with manual prompting, random
            screenshots, and no consistent measurement.
          </div>
        </div>
      </section>

      {/* ── Solution (How It Works) ── */}
      <section id="solution" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="max-w-[640px] mb-12">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              AI Visibility OS for professionals, founders, and personal brands.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                tag: "Track",
                accent: false,
                items: [
                  "Mention trend by model (ChatGPT / Claude / Gemini / Perplexity)",
                  "Prompt-level visibility for your core topics",
                  "Competitor share-of-voice movement",
                ],
              },
              {
                tag: "Diagnose",
                accent: true,
                items: [
                  "Citation/source breakdown (where AI pulls from)",
                  "Missing-entity and coverage gaps",
                  "Volatility and confidence flags",
                ],
              },
              {
                tag: "Act",
                accent: false,
                items: [
                  "Weekly action plan tied to your gaps",
                  "Priority tasks ranked by expected impact",
                  "Change log to see what moved results",
                ],
              },
            ].map((pillar) => (
              <div
                key={pillar.tag}
                className={`rounded-2xl border bg-card p-7 hover:shadow-md transition-shadow ${
                  pillar.accent ? "border-foreground shadow-sm" : ""
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider mb-4 block ${
                    pillar.accent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {pillar.tag}
                </span>
                <ul className="list-disc pl-4 space-y-2.5">
                  {pillar.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Differentiators ── */}
      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="max-w-[640px] mb-12">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Why AIknowsMe
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              What makes this different.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                num: "1",
                title: "No fake guarantees",
                text: 'We don\u2019t promise "#1 in ChatGPT." We provide transparent measurement and practical actions.',
              },
              {
                num: "2",
                title: "Built for decisions, not screenshots",
                text: 'Every report ends with: "Do these 3 things next."',
              },
              {
                num: "3",
                title: "Revenue-aware workflow",
                text: "Track visibility and compare with traffic and conversion shifts over time.",
              },
            ].map((diff) => (
              <div
                key={diff.num}
                className="rounded-2xl border bg-background p-7 hover:shadow-md transition-shadow"
              >
                <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg text-[13px] font-bold bg-foreground text-background mb-3.5">
                  {diff.num}
                </span>
                <h3 className="text-base font-semibold mb-2">{diff.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {diff.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ICP ── */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-12">
            Who This Is For
          </p>

          <div className="grid md:grid-cols-[1.2fr_.8fr] gap-5 items-start">
            <ul className="space-y-3">
              {[
                "High-stakes professionals: lawyers, doctors, financial advisors, and other YMYL fields where AI citations drive referrals",
                "Founders building personal or company authority in their category",
                "Personal brand builders: speakers, coaches, educators, and experts who need to be cited \u2014 not just ranked",
              ].map((item) => (
                <li
                  key={item}
                  className="text-[15px] text-muted-foreground leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="border border-dashed rounded-2xl p-6 h-full">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Not ideal for
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Anyone looking for a magic-ranking button or guaranteed AI
                mentions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="max-w-[640px] mb-12">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Common questions.
            </h2>
          </div>

          <FAQ />
        </div>
      </section>

      {/* ── Final CTA / Waitlist ── */}
      <section id="waitlist" className="bg-foreground text-background">
        <div className="mx-auto max-w-[600px] px-4 py-20 sm:py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            See where AI answers cite you &mdash; and exactly what to do next.
          </h2>
          <WaitlistForm />
          <p className="mt-3.5 text-sm text-background/50">
            Be the first to get weekly AI visibility tracking.
          </p>
        </div>
      </section>
    </div>
  );
}
