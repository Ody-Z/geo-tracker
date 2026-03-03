"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const INDUSTRIES = [
  "SaaS",
  "Finance",
  "Law",
  "Consulting",
  "IT / Tech",
  "Healthcare",
  "E-commerce",
  "Marketing / Agency",
  "Education",
  "Other",
];

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const body = new FormData();
      body.append("email", email);
      body.append("job_title", jobTitle);
      body.append("industry", industry);
      if (reason) body.append("reason", reason);
      body.append("_subject", "AIknowsMe Waitlist Signup");
      body.append("form_type", "waitlist");

      const res = await fetch("https://formspree.io/f/mlgwvyer", {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });

      if (!res.ok) {
        setStatus("idle");
        return;
      }

      setStatus("submitted");
    } catch {
      setStatus("idle");
    }
  }

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <CheckCircle2 className="h-10 w-10 text-green-400" />
        <p className="text-lg font-semibold">You&apos;re on the list!</p>
        <p className="text-sm text-background/50">
          We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-background/20 bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-background/40";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-3"
    >
      <input
        type="email"
        required
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <div className="flex gap-3">
        <input
          type="text"
          required
          placeholder="Job title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className={inputClass}
        />
        <select
          required
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className={`${inputClass} ${!industry ? "text-muted-foreground" : ""}`}
        >
          <option value="" disabled>
            Industry
          </option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>
      <textarea
        placeholder="Why do you want AI to mention you more? (optional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-background/20 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-background/40 resize-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="h-11 w-full rounded-lg bg-background text-sm font-medium text-foreground hover:bg-background/90 transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? (
          <span className="inline-flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Joining...
          </span>
        ) : (
          "Join Waitlist"
        )}
      </button>
    </form>
  );
}
