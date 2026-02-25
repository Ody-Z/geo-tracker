"use client";

import { AI_MODELS, MODEL_KEYS, type ModelKey } from "@/lib/ai/models";
import { CheckCircle, XCircle } from "lucide-react";
import { truncate } from "@/lib/utils";

interface ResultData {
  model: string;
  query: string;
  brandMentioned: boolean;
  visibilityScore: number;
}

interface QueryPerformanceGridProps {
  results: ResultData[];
  queries: string[];
}

export function QueryPerformanceGrid({
  results,
  queries,
}: QueryPerformanceGridProps) {
  if (results.length === 0) {
    return null;
  }

  // Build a query × model matrix
  const matrix: Record<string, Record<string, ResultData>> = {};
  for (const q of queries) {
    matrix[q] = {};
  }
  for (const r of results) {
    if (matrix[r.query]) {
      matrix[r.query][r.model] = r;
    }
  }

  return (
    <div className="rounded-xl border overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium min-w-[200px]">
              Query
            </th>
            {MODEL_KEYS.map((key) => (
              <th key={key} className="px-4 py-3 text-center font-medium">
                <div className="flex items-center justify-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: AI_MODELS[key].color }}
                  />
                  {AI_MODELS[key].name}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {queries.map((query) => (
            <tr key={query} className="border-b last:border-0">
              <td className="px-4 py-3 text-muted-foreground">
                {truncate(query, 50)}
              </td>
              {MODEL_KEYS.map((key) => {
                const result = matrix[query]?.[key];
                return (
                  <td key={key} className="px-4 py-3 text-center">
                    {result ? (
                      <div className="flex flex-col items-center gap-1">
                        {result.brandMentioned ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground/50" />
                        )}
                        <span className="text-xs font-medium">
                          {result.visibilityScore}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
