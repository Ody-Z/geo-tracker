type Sentiment = "positive" | "neutral" | "negative" | "not_mentioned";

interface Citation {
  url: string;
  brandRelated: boolean;
}

export interface ParseResult {
  brandMentioned: boolean;
  domainMentioned: boolean;
  mentionCount: number;
  mentionPositions: number[];
  citations: Citation[];
  sentiment: Sentiment;
  visibilityScore: number;
  rankPosition: number | null;
}

const POSITIVE_KEYWORDS = [
  "recommend",
  "best",
  "leading",
  "top",
  "excellent",
  "great",
  "popular",
  "trusted",
  "innovative",
  "powerful",
  "reliable",
  "outstanding",
];

const NEGATIVE_KEYWORDS = [
  "avoid",
  "worst",
  "poor",
  "bad",
  "unreliable",
  "expensive",
  "limited",
  "outdated",
  "controversial",
  "criticized",
  "problematic",
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectMentions(
  text: string,
  brandName: string
): { count: number; positions: number[] } {
  const escaped = escapeRegex(brandName);
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  const positions: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    positions.push(match.index);
  }

  return { count: positions.length, positions };
}

function detectDomain(text: string, domain: string | null): boolean {
  if (!domain) return false;
  const escaped = escapeRegex(domain);
  const regex = new RegExp(escaped, "gi");
  return regex.test(text);
}

function extractCitations(
  text: string,
  brandName: string,
  domain: string | null,
  perplexityCitations?: string[]
): Citation[] {
  const citations: Citation[] = [];

  // Perplexity structured citations
  if (perplexityCitations?.length) {
    for (const url of perplexityCitations) {
      const brandRelated =
        url.toLowerCase().includes(brandName.toLowerCase()) ||
        (domain ? url.toLowerCase().includes(domain.toLowerCase()) : false);
      citations.push({ url, brandRelated });
    }
    return citations;
  }

  // Fallback: extract markdown links
  const linkRegex = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
  let linkMatch: RegExpExecArray | null;

  while ((linkMatch = linkRegex.exec(text)) !== null) {
    const url = linkMatch[2];
    const linkText = linkMatch[1];
    const brandRelated =
      url.toLowerCase().includes(brandName.toLowerCase()) ||
      linkText.toLowerCase().includes(brandName.toLowerCase()) ||
      (domain ? url.toLowerCase().includes(domain.toLowerCase()) : false);
    citations.push({ url, brandRelated });
  }

  return citations;
}

function detectRankPosition(
  text: string,
  brandName: string
): number | null {
  // Look for numbered lists: "1. BrandName..." or "1) BrandName..."
  const lines = text.split("\n");
  const escaped = escapeRegex(brandName);
  const brandRegex = new RegExp(escaped, "i");

  for (const line of lines) {
    const listMatch = line.match(/^\s*(\d+)[.)]\s+/);
    if (listMatch && brandRegex.test(line)) {
      return parseInt(listMatch[1], 10);
    }
  }

  return null;
}

function detectSentiment(
  text: string,
  brandName: string,
  mentioned: boolean
): Sentiment {
  if (!mentioned) return "not_mentioned";

  const lowerText = text.toLowerCase();

  // Look for sentiment keywords near brand mentions
  const escaped = escapeRegex(brandName);
  const contextRegex = new RegExp(
    `.{0,100}\\b${escaped}\\b.{0,100}`,
    "gi"
  );
  const contexts = lowerText.match(contextRegex) || [lowerText];

  let positiveScore = 0;
  let negativeScore = 0;

  for (const ctx of contexts) {
    for (const kw of POSITIVE_KEYWORDS) {
      if (ctx.includes(kw)) positiveScore++;
    }
    for (const kw of NEGATIVE_KEYWORDS) {
      if (ctx.includes(kw)) negativeScore++;
    }
  }

  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
}

function calculateVisibilityScore(params: {
  brandMentioned: boolean;
  domainMentioned: boolean;
  mentionCount: number;
  rankPosition: number | null;
  hasBrandCitation: boolean;
  sentiment: Sentiment;
}): number {
  if (!params.brandMentioned) return 0;

  let score = 40; // base score for being mentioned

  if (params.domainMentioned) score += 10;
  if (params.mentionCount >= 3) score += 8;

  // Rank position bonus
  if (params.rankPosition === 1) score += 15;
  else if (params.rankPosition === 2) score += 10;
  else if (params.rankPosition === 3) score += 5;

  // Citation bonus
  if (params.hasBrandCitation) score += 12;

  // Sentiment modifier
  if (params.sentiment === "positive") score += 5;
  else if (params.sentiment === "negative") score -= 10;

  return Math.min(100, Math.max(0, score));
}

export function parseResponse(
  responseText: string,
  brandName: string,
  domain: string | null,
  perplexityCitations?: string[]
): ParseResult {
  const { count: mentionCount, positions: mentionPositions } = detectMentions(
    responseText,
    brandName
  );
  const brandMentioned = mentionCount > 0;
  const domainMentioned = detectDomain(responseText, domain);
  const citations = extractCitations(
    responseText,
    brandName,
    domain,
    perplexityCitations
  );
  const rankPosition = detectRankPosition(responseText, brandName);
  const sentiment = detectSentiment(responseText, brandName, brandMentioned);
  const hasBrandCitation = citations.some((c) => c.brandRelated);

  const visibilityScore = calculateVisibilityScore({
    brandMentioned,
    domainMentioned,
    mentionCount,
    rankPosition,
    hasBrandCitation,
    sentiment,
  });

  return {
    brandMentioned,
    domainMentioned,
    mentionCount,
    mentionPositions,
    citations,
    sentiment,
    visibilityScore,
    rankPosition,
  };
}
