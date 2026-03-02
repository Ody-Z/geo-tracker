export interface ScanResult {
  id: string;
  model: string;
  query: string;
  queryId: string;
  responseText: string | null;
  brandMentioned: boolean;
  domainMentioned: boolean;
  mentionCount: number;
  mentionPositions: number[];
  citations: { url: string; brandRelated: boolean }[];
  sentiment: string;
  visibilityScore: number;
  rankPosition: number | null;
}

export interface ScanData {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  overallScore: number | null;
  createdAt: string;
  completedAt: string | null;
  brand: {
    name: string;
    domain?: string | null;
  };
  results: ScanResult[];
}
