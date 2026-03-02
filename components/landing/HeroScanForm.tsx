"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function HeroScanForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [background, setBackground] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        setError("Name is required");
        setIsSubmitting(false);
        return;
      }

      if (background.trim().length < 10) {
        setError("Please provide at least 10 characters about your background");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          background: background.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to start scan");
        setIsSubmitting(false);
        return;
      }

      const { scanId } = await response.json();
      router.push(`/results/${scanId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[480px] mx-auto">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 rounded-lg border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          required
        />
        <textarea
          placeholder="Your background (e.g., Career coach for software engineers in Sydney)"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          maxLength={500}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
          required
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full h-12 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning AI models...
          </>
        ) : (
          "Check if AI knows you"
        )}
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Free &middot; No signup required &middot; Results in 30 seconds
      </p>
    </form>
  );
}
