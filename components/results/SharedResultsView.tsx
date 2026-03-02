"use client";

import { ResultsHero } from "./ResultsHero";
import { ModelResultCard } from "./ModelResultCard";
import { ShareCTA } from "./ShareCTA";
import { MODEL_KEYS } from "@/lib/ai/models";
import type { ScanData } from "@/lib/types/scan";

interface SharedResultsViewProps {
  scan: ScanData;
}

export function SharedResultsView({ scan }: SharedResultsViewProps) {
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
      <ShareCTA />

      <ResultsHero
        overallScore={scan.overallScore || 0}
        brandName={scan.brand.name}
        createdAt={scan.createdAt}
        modelMentions={modelMentions}
        scanId={scan.id}
        isSharedView
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

      <ShareCTA />
    </div>
  );
}
