"use client";

import { useState } from "react";
import { ResponseExcerpt } from "./ResponseExcerpt";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";
interface QueryResult {
  id?: string;
  query: string;
  responseText: string | null;
  brandMentioned: boolean;
}

interface QueryResponseListProps {
  results: QueryResult[];
  brandName: string;
}

export function QueryResponseList({ results, brandName }: QueryResponseListProps) {
  const [expanded, setExpanded] = useState(false);

  if (results.length === 0) return null;

  const visibleResults = expanded ? results : results.slice(0, 2);
  const hiddenCount = results.length - 2;

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Queries & Responses
      </p>
      {visibleResults.map((result, i) => (
        <div key={result.id || i} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
            <p className="text-sm font-medium leading-snug flex-1">{result.query}</p>
            {result.brandMentioned ? (
              <Badge variant="success" className="shrink-0 text-[10px] gap-0.5">
                <CheckCircle className="h-2.5 w-2.5" />
                Mentioned
              </Badge>
            ) : (
              <Badge variant="secondary" className="shrink-0 text-[10px] gap-0.5">
                <XCircle className="h-2.5 w-2.5" />
                No mention
              </Badge>
            )}
          </div>
          {result.responseText && (
            <ResponseExcerpt text={result.responseText} brandName={brandName} maxLength={300} />
          )}
        </div>
      ))}
      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline mx-auto"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show {hiddenCount} more {hiddenCount === 1 ? "query" : "queries"}{" "}
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
