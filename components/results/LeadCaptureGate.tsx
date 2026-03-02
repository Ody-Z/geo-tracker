"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const ROLE_OPTIONS = [
  "Lawyer / Legal",
  "Doctor / Healthcare",
  "Financial Advisor",
  "SaaS Founder",
  "Startup Founder",
  "Coach / Consultant",
  "Speaker / Educator",
  "Personal Brand Builder",
  "Marketer / Agency",
  "Other",
];

const GOAL_OPTIONS = [
  { value: "leads", label: "More inbound leads" },
  { value: "reputation", label: "Stronger reputation" },
  { value: "authority", label: "Build category authority" },
  { value: "inbound", label: "Increase organic inbound" },
];

interface LeadCaptureGateProps {
  scanId: string;
  brandName: string;
  onUnlocked: () => void;
}

export function LeadCaptureGate({
  scanId,
  brandName,
  onUnlocked,
}: LeadCaptureGateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    if (!email?.trim()) {
      setError("Email is required");
      return;
    }
    if (!role) {
      setError("Please select your role");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://formspree.io/f/mlgwvyer", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem(`aiknowsme_unlocked_${scanId}`, "true");
      onUnlocked();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Your report for &ldquo;{brandName}&rdquo; is ready
          </h2>
          <p className="text-muted-foreground">
            Enter your details to unlock your AI visibility report.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm space-y-5"
        >
          <input type="hidden" name="_subject" value="AIknowsMe Report Unlock" />
          <input type="hidden" name="scan_id" value={scanId} />
          <input type="hidden" name="brand_name" value={brandName} />

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold" htmlFor="gate-email">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="gate-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold" htmlFor="gate-role">
              Role / Field <span className="text-destructive">*</span>
            </label>
            <select
              id="gate-role"
              name="role"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue=""
            >
              <option value="" disabled>
                Select your role
              </option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* LinkedIn + X Handle */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="gate-linkedin">
                LinkedIn URL{" "}
                <span className="text-muted-foreground font-normal text-[13px]">
                  (optional)
                </span>
              </label>
              <Input
                id="gate-linkedin"
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/you"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="gate-x">
                X Handle{" "}
                <span className="text-muted-foreground font-normal text-[13px]">
                  (optional)
                </span>
              </label>
              <Input
                id="gate-x"
                name="x_handle"
                type="text"
                placeholder="@yourhandle"
              />
            </div>
          </div>

          {/* City + Goal */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="gate-city">
                City / Market{" "}
                <span className="text-muted-foreground font-normal text-[13px]">
                  (optional)
                </span>
              </label>
              <Input
                id="gate-city"
                name="city_market"
                type="text"
                placeholder="e.g. New York, London…"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="gate-goal">
                Main Goal{" "}
                <span className="text-muted-foreground font-normal text-[13px]">
                  (optional)
                </span>
              </label>
              <select
                id="gate-goal"
                name="main_goal"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a goal
                </option>
                {GOAL_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pain */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold" htmlFor="gate-pain">
              Current AI visibility pain{" "}
              <span className="text-muted-foreground font-normal text-[13px]">
                (optional)
              </span>
            </label>
            <textarea
              id="gate-pain"
              name="ai_visibility_pain"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[84px]"
              placeholder="e.g. ChatGPT never mentions me when users ask about my specialty…"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Unlocking...
              </>
            ) : (
              "Unlock My Report"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
