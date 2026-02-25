import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands, profiles, scans } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { runScan } from "@/lib/ai/orchestrator";
import { sendScoreDropEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all pro users' brands
    const proProfiles = await db.query.profiles.findMany({
      where: eq(profiles.plan, "pro"),
    });

    const proUserIds = proProfiles.map((p) => p.id);

    if (proUserIds.length === 0) {
      return NextResponse.json({ message: "No pro users", scansCreated: 0 });
    }

    // Get all brands for pro users
    const allBrands = await db.query.brands.findMany({
      where: eq(brands.isAnonymous, false),
      with: {
        scans: {
          orderBy: [desc(scans.createdAt)],
          limit: 1,
        },
      },
    });

    const proBrands = allBrands.filter(
      (b) => b.userId && proUserIds.includes(b.userId)
    );

    // Batch process: 5 concurrent
    const BATCH_SIZE = 5;
    let scansCreated = 0;

    for (let i = 0; i < proBrands.length; i += BATCH_SIZE) {
      const batch = proBrands.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (brand) => {
          // Create scan
          const [scan] = await db
            .insert(scans)
            .values({
              brandId: brand.id,
              status: "pending",
              triggeredBy: "cron",
            })
            .returning();

          await runScan(scan.id);
          scansCreated++;

          // Check for score drop > 10 points
          const previousScan = brand.scans[0];
          if (previousScan?.overallScore !== null) {
            const completedScan = await db.query.scans.findFirst({
              where: eq(scans.id, scan.id),
            });

            if (
              completedScan?.overallScore !== null &&
              completedScan?.overallScore !== undefined &&
              previousScan.overallScore !== null &&
              previousScan.overallScore - completedScan.overallScore > 10
            ) {
              // Find user email
              const profile = proProfiles.find((p) => p.id === brand.userId);
              if (profile) {
                await sendScoreDropEmail({
                  to: profile.email,
                  brandName: brand.name,
                  previousScore: previousScan.overallScore,
                  currentScore: completedScan.overallScore,
                  scanId: scan.id,
                });
              }
            }
          }
        })
      );
    }

    return NextResponse.json({
      message: "Weekly scans completed",
      scansCreated,
      brandsProcessed: proBrands.length,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}
