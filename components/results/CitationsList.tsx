import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Citation {
  url: string;
  brandRelated: boolean;
}

interface CitationsListProps {
  citations: Citation[];
}

export function CitationsList({ citations }: CitationsListProps) {
  if (citations.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Citations
      </p>
      <ul className="space-y-1.5">
        {citations.map((citation, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-primary hover:underline"
            >
              {citation.url}
            </a>
            {citation.brandRelated && (
              <Badge variant="success" className="shrink-0 text-[10px]">
                Brand
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
