"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ResultsHero } from "@/components/results/ResultsHero";
import { ModelResultCard } from "@/components/results/ModelResultCard";
import { UpgradeCTA } from "@/components/results/UpgradeCTA";
import { ScanProgress } from "@/components/scan/ScanProgress";
import { LeadCaptureGate } from "@/components/results/LeadCaptureGate";
import { MODEL_KEYS } from "@/lib/ai/models";
import type { ScanData } from "@/lib/types/scan";

export default function ResultsPage() {
  const { scanId } = useParams<{ scanId: string }>();
  const [scan, setScan] = useState<ScanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    if (scanId) {
      setUnlocked(
        localStorage.getItem(`aiknowsme_unlocked_${scanId}`) === "true"
      );
    }
  }, [scanId]);

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

  const handleUnlocked = useCallback(() => {
    setUnlocked(true);
  }, []);

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

  // Scan completed — show gate if not unlocked
  if (!unlocked) {
    return (
      <LeadCaptureGate
        scanId={scanId}
        brandName={scan.brand.name}
        onUnlocked={handleUnlocked}
      />
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
    modelMentions[key] =
      resultsByModel[key]?.some((r) => r.brandMentioned) || false;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-8">
      <ResultsHero
        overallScore={scan.overallScore || 0}
        brandName={scan.brand.name}
        createdAt={scan.createdAt}
        modelMentions={modelMentions}
        scanId={scan.id}
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
