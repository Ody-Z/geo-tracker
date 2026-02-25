"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Plus, X, Loader2 } from "lucide-react";

const EXAMPLE_QUERIES = [
  "What is the best [product category] software?",
  "Compare [your brand] vs [competitor]",
  "What do people think about [your brand]?",
];

export function ScanForm() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [domain, setDomain] = useState("");
  const [queries, setQueries] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addQuery() {
    if (queries.length < 3) {
      setQueries([...queries, ""]);
    }
  }

  function removeQuery(index: number) {
    if (queries.length > 1) {
      setQueries(queries.filter((_, i) => i !== index));
    }
  }

  function updateQuery(index: number, value: string) {
    const updated = [...queries];
    updated[index] = value;
    setQueries(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const filteredQueries = queries.filter((q) => q.trim().length > 0);

      if (!brandName.trim()) {
        setError("Brand name is required");
        setIsSubmitting(false);
        return;
      }

      if (filteredQueries.length === 0) {
        setError("At least one query is required");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          domain: domain.trim() || undefined,
          queries: filteredQueries,
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
          Scan Your Brand
        </CardTitle>
        <CardDescription>
          Enter your brand details and up to 3 queries to see how AI models
          perceive your brand.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="brandName">
              Brand Name *
            </label>
            <Input
              id="brandName"
              placeholder="e.g., Acme Corp"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="domain">
              Domain (optional)
            </label>
            <Input
              id="domain"
              placeholder="e.g., acme.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll check if AI models link to your website.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Queries ({queries.length}/3)
              </label>
              {queries.length < 3 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addQuery}
                  className="gap-1 text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Add query
                </Button>
              )}
            </div>

            {queries.map((query, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={
                    EXAMPLE_QUERIES[index] || "Enter a query..."
                  }
                  value={query}
                  onChange={(e) => updateQuery(index, e.target.value)}
                />
                {queries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuery(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Enter the queries your potential customers might ask AI assistants
              about your product category.
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
                Starting scan...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Run Free Scan
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
