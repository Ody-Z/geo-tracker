"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponseExcerpt } from "./ResponseExcerpt";
import { CitationsList } from "./CitationsList";
import { AI_MODELS, type ModelKey } from "@/lib/ai/models";
import { CheckCircle, XCircle, Hash, TrendingUp } from "lucide-react";

interface ModelResult {
  model: string;
  query: string;
  responseText: string | null;
  brandMentioned: boolean;
  domainMentioned: boolean;
  mentionCount: number;
  citations: { url: string; brandRelated: boolean }[];
  sentiment: string;
  visibilityScore: number;
  rankPosition: number | null;
}

interface ModelResultCardProps {
  modelKey: ModelKey;
  results: ModelResult[];
  brandName: string;
}

const SENTIMENT_MAP: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  positive: { label: "Positive", variant: "success" },
  neutral: { label: "Neutral", variant: "secondary" },
  negative: { label: "Negative", variant: "destructive" },
  not_mentioned: { label: "Not Mentioned", variant: "secondary" },
};

export function ModelResultCard({
  modelKey,
  results,
  brandName,
}: ModelResultCardProps) {
  const model = AI_MODELS[modelKey];

  // Aggregate stats across all queries for this model
  const anyMentioned = results.some((r) => r.brandMentioned);
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.visibilityScore, 0) /
            results.length
        )
      : 0;
  const totalMentions = results.reduce((sum, r) => sum + r.mentionCount, 0);
  const allCitations = results.flatMap((r) => r.citations || []);
  const bestRank = results
    .map((r) => r.rankPosition)
    .filter((r): r is number => r !== null)
    .sort((a, b) => a - b)[0];

  // Use the first result's response as the primary excerpt
  const primaryResult = results[0];
  const dominantSentiment = results.reduce(
    (acc, r) => {
      if (r.sentiment === "positive") acc.positive++;
      else if (r.sentiment === "negative") acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );

  const sentiment =
    dominantSentiment.positive > dominantSentiment.negative
      ? "positive"
      : dominantSentiment.negative > dominantSentiment.positive
        ? "negative"
        : anyMentioned
          ? "neutral"
          : "not_mentioned";

  const sentimentInfo = SENTIMENT_MAP[sentiment] || SENTIMENT_MAP.not_mentioned;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: model.color }}
            />
            {model.name}
          </CardTitle>
          {anyMentioned ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Mentioned
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Not mentioned
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Visibility Score</span>
            <span className="font-semibold">{avgScore}/100</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                width: `${avgScore}%`,
                backgroundColor: model.color,
              }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 text-xs">
          {totalMentions > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Hash className="h-3 w-3" />
              {totalMentions} mention{totalMentions !== 1 ? "s" : ""}
            </div>
          )}
          {bestRank && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Ranked #{bestRank}
            </div>
          )}
          <Badge variant={sentimentInfo.variant} className="text-[10px]">
            {sentimentInfo.label}
          </Badge>
        </div>

        {/* Response excerpt */}
        {primaryResult?.responseText && (
          <ResponseExcerpt
            text={primaryResult.responseText}
            brandName={brandName}
          />
        )}

        {/* Citations */}
        {allCitations.length > 0 && (
          <CitationsList citations={allCitations} />
        )}
      </CardContent>
    </Card>
  );
}
