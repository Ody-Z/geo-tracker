"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing/PricingCard";

const FREE_FEATURES = [
  { text: "One-time brand scan", included: true },
  { text: "3 queries per scan", included: true },
  { text: "All 4 AI models", included: true },
  { text: "Shareable results link (7 days)", included: true },
  { text: "Weekly automated scans", included: false },
  { text: "Trend charts & history", included: false },
  { text: "Score drop email alerts", included: false },
  { text: "CSV/JSON export", included: false },
];

const PRO_FEATURES = [
  { text: "Up to 5 brands", included: true },
  { text: "10 queries per scan", included: true },
  { text: "All 4 AI models", included: true },
  { text: "Weekly automated scans", included: true },
  { text: "12 months history retention", included: true },
  { text: "Full dashboard & trend charts", included: true },
  { text: "Score drop email alerts", included: true },
  { text: "CSV/JSON export", included: true },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: billing }),
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-muted-foreground">
          Start free. Upgrade when you need automated monitoring.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center rounded-lg border p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billing === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billing === "yearly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <span className="ml-1.5 text-xs text-emerald-600">Save 28%</span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
        <PricingCard
          name="Free"
          price="$0"
          description="Try it out with a single scan."
          features={FREE_FEATURES}
          cta="Start Free Scan"
          ctaHref="/scan"
        />
        <PricingCard
          name="Pro"
          price={billing === "monthly" ? "$29" : "$249"}
          period={billing === "monthly" ? "mo" : "yr"}
          description="Everything you need for ongoing AI visibility monitoring."
          features={PRO_FEATURES}
          cta="Get Started"
          ctaHref="#"
          highlighted
          badge="Most Popular"
          onCtaClick={handleCheckout}
          loading={loading}
        />
      </div>
    </div>
  );
}
