import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { scans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SharedResultsView } from "@/components/results/SharedResultsView";
import type { Metadata } from "next";
import type { ScanData } from "@/lib/types/scan";

interface SharePageProps {
  params: Promise<{ scanId: string }>;
}

async function getScan(scanId: string): Promise<ScanData | null> {
  const scan = await db.query.scans.findFirst({
    where: eq(scans.id, scanId),
    with: {
      brand: true,
      results: {
        with: {
          query: true,
        },
      },
    },
  });

  if (!scan) return null;

  // Check expiry
  if (scan.expiresAt && new Date(scan.expiresAt) < new Date()) {
    return null;
  }

  return {
    id: scan.id,
    status: scan.status,
    overallScore: scan.overallScore,
    createdAt: scan.createdAt?.toISOString() ?? new Date().toISOString(),
    completedAt: scan.completedAt?.toISOString() ?? null,
    brand: {
      name: scan.brand.name,
    },
    results: scan.results.map((r) => ({
      id: r.id,
      model: r.model,
      query: r.query.promptText,
      queryId: r.queryId,
      responseText: r.responseText,
      brandMentioned: r.brandMentioned,
      domainMentioned: r.domainMentioned,
      mentionCount: r.mentionCount,
      mentionPositions: r.mentionPositions ?? [],
      citations: (r.citations ?? []) as { url: string; brandRelated: boolean }[],
      sentiment: r.sentiment,
      visibilityScore: r.visibilityScore,
      rankPosition: r.rankPosition,
    })),
  };
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { scanId } = await params;
  const scan = await getScan(scanId);

  if (!scan || scan.status !== "completed") {
    return { title: "AIknowsMe - Shared Report" };
  }

  const score = scan.overallScore ?? 0;
  return {
    title: `${scan.brand.name} AI Visibility: ${score}/100 | AIknowsMe`,
    description: `See how ${scan.brand.name} scores ${score}/100 across ChatGPT, Claude, Perplexity, and Gemini. Check your own AI visibility for free.`,
    openGraph: {
      title: `${scan.brand.name} AI Visibility: ${score}/100`,
      description: `See how ${scan.brand.name} scores across major AI models. Check your own brand for free.`,
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { scanId } = await params;
  const scan = await getScan(scanId);

  if (!scan) {
    notFound();
  }

  if (scan.status !== "completed") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-xl border bg-card p-12 text-center">
          <h2 className="text-xl font-semibold">Scan Still Processing</h2>
          <p className="mt-2 text-muted-foreground">
            This scan is still being processed. Please check back in a moment.
          </p>
        </div>
      </div>
    );
  }

  return <SharedResultsView scan={scan} />;
}
