"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ResultsHero } from "@/components/results/ResultsHero";
import { ModelResultCard } from "@/components/results/ModelResultCard";
import { UpgradeCTA } from "@/components/results/UpgradeCTA";
import { ScanProgress } from "@/components/scan/ScanProgress";
import { MODEL_KEYS, type ModelKey } from "@/lib/ai/models";

interface ScanData {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  overallScore: number | null;
  createdAt: string;
  completedAt: string | null;
  brand: {
    name: string;
    domain: string | null;
  };
  results: {
    id: string;
    model: string;
    query: string;
    queryId: string;
    responseText: string | null;
    brandMentioned: boolean;
    domainMentioned: boolean;
    mentionCount: number;
    mentionPositions: number[];
    citations: { url: string; brandRelated: boolean }[];
    sentiment: string;
    visibilityScore: number;
    rankPosition: number | null;
  }[];
}

export default function ResultsPage() {
  const { scanId } = useParams<{ scanId: string }>();
  const [scan, setScan] = useState<ScanData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) return;

    let intervalId: NodeJS.Timeout;

    async function fetchScan() {
      try {
        const res = await fetch(`/api/scans/${scanId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load scan");
          return;
        }
        const data: ScanData = await res.json();
        setScan(data);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(intervalId);
        }
      } catch {
        setError("Failed to load scan results");
      }
    }

    fetchScan();
    intervalId = setInterval(fetchScan, 2000);

    return () => clearInterval(intervalId);
  }, [scanId]);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-xl border bg-card p-12 text-center">
          <h2 className="text-xl font-semibold text-destructive">Error</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!scan || scan.status === "pending" || scan.status === "running") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ScanProgress />
      </div>
    );
  }

  if (scan.status === "failed") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-xl border bg-card p-12 text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Scan Failed
          </h2>
          <p className="mt-2 text-muted-foreground">
            Something went wrong while scanning. Please try again.
          </p>
        </div>
      </div>
    );
  }

  // Group results by model
  const resultsByModel: Record<string, ScanData["results"]> = {};
  for (const result of scan.results) {
    if (!resultsByModel[result.model]) {
      resultsByModel[result.model] = [];
    }
    resultsByModel[result.model].push(result);
  }

  // Model mentions map
  const modelMentions: Record<string, boolean> = {};
  for (const key of MODEL_KEYS) {
    modelMentions[key] = resultsByModel[key]?.some((r) => r.brandMentioned) || false;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-8">
      <ResultsHero
        overallScore={scan.overallScore || 0}
        brandName={scan.brand.name}
        createdAt={scan.createdAt}
        modelMentions={modelMentions}
      />

      {/* Model results grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {MODEL_KEYS.map((key) => (
          <ModelResultCard
            key={key}
            modelKey={key}
            results={resultsByModel[key] || []}
            brandName={scan.brand.name}
          />
        ))}
      </div>

      <UpgradeCTA brandName={scan.brand.name} />
    </div>
  );
}
