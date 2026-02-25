import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands, queries, scans } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createBrandSchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().max(200).optional().transform((v) => v || null),
  queries: z
    .array(z.string().min(10).max(500))
    .min(1)
    .max(10),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userBrands = await db.query.brands.findMany({
      where: and(eq(brands.userId, user.id), eq(brands.isAnonymous, false)),
      with: {
        scans: {
          orderBy: [desc(scans.createdAt)],
          limit: 8,
        },
      },
      orderBy: [desc(brands.createdAt)],
    });

    return NextResponse.json(userBrands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createBrandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Check brand limit (free: 1, pro: 5)
    const existingBrands = await db.query.brands.findMany({
      where: and(eq(brands.userId, user.id), eq(brands.isAnonymous, false)),
    });

    // TODO: Check user plan for limit
    if (existingBrands.length >= 5) {
      return NextResponse.json(
        { error: "Brand limit reached" },
        { status: 403 }
      );
    }

    const [brand] = await db
      .insert(brands)
      .values({
        userId: user.id,
        name: parsed.data.name,
        domain: parsed.data.domain,
        isAnonymous: false,
      })
      .returning();

    // Create queries
    for (let i = 0; i < parsed.data.queries.length; i++) {
      await db.insert(queries).values({
        brandId: brand.id,
        promptText: parsed.data.queries[i],
        sortOrder: i,
      });
    }

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
