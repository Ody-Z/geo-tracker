import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scans, scanResults, queries, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  try {
    const { scanId } = await params;

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

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    // Check expiry
    if (scan.expiresAt && new Date(scan.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This scan has expired" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      id: scan.id,
      status: scan.status,
      overallScore: scan.overallScore,
      createdAt: scan.createdAt,
      completedAt: scan.completedAt,
      brand: {
        name: scan.brand.name,
        domain: scan.brand.domain,
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
        mentionPositions: r.mentionPositions,
        citations: r.citations,
        sentiment: r.sentiment,
        visibilityScore: r.visibilityScore,
        rankPosition: r.rankPosition,
      })),
    });
  } catch (error) {
    console.error("Error fetching scan:", error);
    return NextResponse.json(
      { error: "Failed to fetch scan" },
      { status: 500 }
    );
  }
}
