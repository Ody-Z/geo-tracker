import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { db } from "@/lib/db";
import { brands, scans } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { runScan } from "@/lib/ai/orchestrator";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brandId } = await params;

    // Verify ownership
    const brand = await db.query.brands.findFirst({
      where: and(eq(brands.id, brandId), eq(brands.userId, user.id)),
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandScans = await db.query.scans.findMany({
      where: eq(scans.brandId, brandId),
      with: {
        results: {
          with: {
            query: true,
          },
        },
      },
      orderBy: [desc(scans.createdAt)],
    });

    return NextResponse.json(brandScans);
  } catch (error) {
    console.error("Error fetching brand scans:", error);
    return NextResponse.json(
      { error: "Failed to fetch scans" },
      { status: 500 }
    );
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brandId } = await params;

    // Verify ownership
    const brand = await db.query.brands.findFirst({
      where: and(eq(brands.id, brandId), eq(brands.userId, user.id)),
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const [scan] = await db
      .insert(scans)
      .values({
        brandId,
        status: "pending",
        triggeredBy: "manual",
      })
      .returning();

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
