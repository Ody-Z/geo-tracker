import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands, queries } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

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

    const brand = await db.query.brands.findFirst({
      where: and(eq(brands.id, brandId), eq(brands.userId, user.id)),
      with: {
        queries: true,
        scans: {
          with: {
            results: true,
          },
          orderBy: (scans, { desc }) => [desc(scans.createdAt)],
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const brand = await db.query.brands.findFirst({
      where: and(eq(brands.id, brandId), eq(brands.userId, user.id)),
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    await db.delete(brands).where(eq(brands.id, brandId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
