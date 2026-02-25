import { db } from "@/lib/db";
import {
  scans,
  scanResults,
  brands,
  queries,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AI_MODELS, MODEL_KEYS, type ModelKey } from "./models";
import { queryOpenAI } from "./openai";
import { queryAnthropic } from "./anthropic";
import { queryPerplexity } from "./perplexity";
import { queryGemini } from "./gemini";
import { parseResponse } from "./parser";
import { truncate } from "@/lib/utils";

const MODEL_QUERY_FNS: Record<
  ModelKey,
  (prompt: string) => Promise<{ text: string; citations?: string[] }>
> = {
  openai: async (p) => ({ text: await queryOpenAI(p) }),
  anthropic: async (p) => ({ text: await queryAnthropic(p) }),
  perplexity: async (p) => {
    const r = await queryPerplexity(p);
    return { text: r.text, citations: r.citations };
  },
  gemini: async (p) => ({ text: await queryGemini(p) }),
};

async function runSingleQuery(
  scanId: string,
  queryId: string,
  prompt: string,
  brandName: string,
  domain: string | null,
  model: ModelKey
): Promise<void> {
  try {
    const queryFn = MODEL_QUERY_FNS[model];
    const response = await queryFn(prompt);

    const parsed = parseResponse(
      response.text,
      brandName,
      domain,
      response.citations
    );

    await db.insert(scanResults).values({
      scanId,
      queryId,
      model,
      responseText: truncate(response.text, 2000),
      brandMentioned: parsed.brandMentioned,
      domainMentioned: parsed.domainMentioned,
      mentionCount: parsed.mentionCount,
      mentionPositions: parsed.mentionPositions,
      citations: parsed.citations,
      sentiment: parsed.sentiment,
      visibilityScore: parsed.visibilityScore,
      rankPosition: parsed.rankPosition,
    });
  } catch (error) {
    console.error(`Error querying ${model} for scan ${scanId}:`, error);

    // Insert a failed result with zero score
    await db.insert(scanResults).values({
      scanId,
      queryId,
      model,
      responseText: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      brandMentioned: false,
      domainMentioned: false,
      mentionCount: 0,
      mentionPositions: [],
      citations: [],
      sentiment: "not_mentioned",
      visibilityScore: 0,
      rankPosition: null,
    });
  }
}

export async function runScan(scanId: string): Promise<void> {
  try {
    // Mark as running
    await db
      .update(scans)
      .set({ status: "running" })
      .where(eq(scans.id, scanId));

    // Load scan with brand and queries
    const scan = await db.query.scans.findFirst({
      where: eq(scans.id, scanId),
      with: {
        brand: {
          with: {
            queries: true,
          },
        },
      },
    });

    if (!scan?.brand) {
      throw new Error(`Scan ${scanId} not found or has no brand`);
    }

    const { brand } = scan;
    const brandQueries = brand.queries;

    // Fan out: query × model
    const tasks: Promise<void>[] = [];

    for (const query of brandQueries) {
      for (const modelKey of MODEL_KEYS) {
        tasks.push(
          runSingleQuery(
            scanId,
            query.id,
            query.promptText,
            brand.name,
            brand.domain,
            modelKey
          )
        );
      }
    }

    await Promise.allSettled(tasks);

    // Compute overall score (weighted average)
    const results = await db.query.scanResults.findMany({
      where: eq(scanResults.scanId, scanId),
    });

    let totalWeight = 0;
    let weightedSum = 0;

    for (const result of results) {
      const modelConfig = AI_MODELS[result.model as ModelKey];
      const weight = modelConfig?.weight || 1.0;
      weightedSum += result.visibilityScore * weight;
      totalWeight += weight;
    }

    const overallScore =
      totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    // Mark completed
    await db
      .update(scans)
      .set({
        status: "completed",
        overallScore,
        completedAt: new Date(),
      })
      .where(eq(scans.id, scanId));
  } catch (error) {
    console.error(`Scan ${scanId} failed:`, error);

    await db
      .update(scans)
      .set({ status: "failed" })
      .where(eq(scans.id, scanId));
  }
}
