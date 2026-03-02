"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";

export function ScanForm() {
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
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Check Your AI Visibility
        </CardTitle>
        <CardDescription>
          Enter your name and background to see how AI models represent you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Your Name *
            </label>
            <Input
              id="name"
              placeholder="e.g., Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="background">
              Your Background *
            </label>
            <textarea
              id="background"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g., Career coach for software engineers in Sydney, specializing in interview prep and salary negotiation"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              maxLength={500}
              required
            />
            <p className="text-xs text-muted-foreground">
              {background.length}/500 characters — We&apos;ll generate AI search queries based on this.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full gap-2"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating queries...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Check if AI knows you
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Free tier: 3 scans per day. No signup required.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
