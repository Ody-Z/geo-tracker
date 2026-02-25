import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAppUrl } from "@/lib/utils";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    if (!profile?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${getAppUrl()}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
