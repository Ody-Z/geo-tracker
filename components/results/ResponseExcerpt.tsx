"use client";

interface ResponseExcerptProps {
  text: string;
  brandName: string;
  maxLength?: number;
}

export function ResponseExcerpt({
  text,
  brandName,
  maxLength = 500,
}: ResponseExcerptProps) {
  const displayText =
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  // Highlight brand name
  const escaped = brandName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(\\b${escaped}\\b)`, "gi");
  const parts = displayText.split(regex);

  return (
    <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="rounded bg-yellow-200 px-0.5 font-medium text-foreground"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
}
