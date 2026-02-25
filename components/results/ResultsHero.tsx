"use client";

import { VisibilityScoreGauge } from "./VisibilityScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AI_MODELS, MODEL_KEYS, type ModelKey } from "@/lib/ai/models";
import { Share2, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";

interface ResultsHeroProps {
  overallScore: number;
  brandName: string;
  createdAt: string;
  modelMentions: Record<string, boolean>;
}

export function ResultsHero({
  overallScore,
  brandName,
  createdAt,
  modelMentions,
}: ResultsHeroProps) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border bg-card p-8 text-center">
      <div className="mb-2 text-sm text-muted-foreground">
        AI Visibility Report for
      </div>
      <h1 className="text-2xl font-bold">{brandName}</h1>

      <div className="mt-6 flex justify-center">
        <VisibilityScoreGauge score={overallScore} />
      </div>

      {/* Model pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {MODEL_KEYS.map((key) => {
          const model = AI_MODELS[key];
          const mentioned = modelMentions[key];
          return (
            <div
              key={key}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: model.color }}
              />
              {model.name}
              {mentioned ? (
                <CheckCircle className="h-3 w-3 text-emerald-600" />
              ) : (
                <XCircle className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      {/* Meta */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDateTime(createdAt)}
        </span>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-1">
          <Share2 className="h-3 w-3" />
          {copied ? "Copied!" : "Share"}
        </Button>
      </div>
    </div>
  );
}
