import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { db } from "@/lib/db";
import { brands, queries, scans } from "@/lib/db/schema";
import { scanFormSchema } from "@/components/scan/scan-schema";
import { runScan } from "@/lib/ai/orchestrator";
import { freeScanLimiter } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    try {
      const { success, remaining } = await freeScanLimiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. You can run 3 free scans per day.",
            remaining: 0,
          },
          { status: 429 }
        );
      }
    } catch {
      // If Upstash is not configured, skip rate limiting (dev mode)
      console.warn("Rate limiting skipped: Upstash not configured");
    }

    const body = await request.json();
    const parsed = scanFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { brandName, domain, queries: queryTexts } = parsed.data;

    // Create brand (anonymous for free scans)
    const [brand] = await db
      .insert(brands)
      .values({
        name: brandName,
        domain,
        isAnonymous: true,
      })
      .returning();

    // Create queries
    for (let i = 0; i < queryTexts.length; i++) {
      await db.insert(queries).values({
        brandId: brand.id,
        promptText: queryTexts[i],
        sortOrder: i,
      });
    }

    // Create scan with 7-day expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [scan] = await db
      .insert(scans)
      .values({
        brandId: brand.id,
        status: "pending",
        triggeredBy: "manual",
        expiresAt,
      })
      .returning();

    // Run scan in the background after response is sent
    after(async () => {
      await runScan(scan.id);
    });

    return NextResponse.json({ scanId: scan.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating scan:", error);
    return NextResponse.json(
      { error: "Failed to create scan" },
      { status: 500 }
    );
  }
}
