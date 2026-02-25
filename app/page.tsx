import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Radar,
  Search,
  BarChart3,
  Bell,
  ArrowRight,
  Sparkles,
  Globe,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              GEO — Generative Engine Optimization
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Is your brand visible to{" "}
              <span className="text-primary">AI?</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Find out how ChatGPT, Claude, Perplexity, and Gemini talk about
              your brand. Run a free scan in seconds — no signup required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/scan">
                <Button size="lg" className="gap-2">
                  <Search className="h-4 w-4" />
                  Run Free Scan
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="gap-2">
                  View Pricing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three steps to understand your AI visibility
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Search,
              title: "1. Enter your brand",
              description:
                "Tell us your brand name, website, and the queries your customers ask AI.",
            },
            {
              icon: Globe,
              title: "2. We scan 4 AI models",
              description:
                "We query ChatGPT, Claude, Perplexity, and Gemini simultaneously and analyze their responses.",
            },
            {
              icon: BarChart3,
              title: "3. Get your score",
              description:
                "See your visibility score (0-100), sentiment analysis, citations, and ranking position.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="relative rounded-xl border bg-card p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to track AI visibility
            </h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Radar,
                title: "Multi-model coverage",
                desc: "Scan ChatGPT, Claude, Perplexity, and Gemini in one click.",
              },
              {
                icon: TrendingUp,
                title: "Trend tracking",
                desc: "Weekly automated scans show how your visibility changes over time.",
              },
              {
                icon: Bell,
                title: "Score drop alerts",
                desc: "Get notified by email when your visibility score drops significantly.",
              },
              {
                icon: BarChart3,
                title: "Detailed analytics",
                desc: "Per-model breakdown, sentiment analysis, citation tracking, and rank position.",
              },
              {
                icon: Globe,
                title: "Shareable reports",
                desc: "Every scan generates a unique URL you can share with your team.",
              },
              {
                icon: Sparkles,
                title: "Actionable insights",
                desc: "Understand exactly how each AI model perceives and recommends your brand.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6"
              >
                <feature.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to check your AI visibility?
          </h2>
          <p className="mt-4 text-muted-foreground">
            No signup required. Results in under 30 seconds.
          </p>
          <div className="mt-8">
            <Link href="/scan">
              <Button size="lg" className="gap-2">
                <Search className="h-4 w-4" />
                Start Free Scan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
