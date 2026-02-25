"use client";

import { Loader2, Radar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AI_MODELS } from "@/lib/ai/models";

const MODEL_LIST = Object.values(AI_MODELS);

export function ScanProgress() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Radar className="h-8 w-8 text-primary animate-spin" />
        </div>
        <h2 className="text-xl font-semibold">Scanning AI Models...</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Querying {MODEL_LIST.length} AI models with your prompts. This
          usually takes 10-20 seconds.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {MODEL_LIST.map((model) => (
            <div
              key={model.name}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
            >
              <div
                className="h-2 w-2 rounded-full animate-pulse-dot"
                style={{ backgroundColor: model.color }}
              />
              {model.name}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing responses...
        </div>
      </CardContent>
    </Card>
  );
}
