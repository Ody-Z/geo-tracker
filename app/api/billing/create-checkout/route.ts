import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAppUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interval } = await request.json();

    const priceId =
      interval === "yearly"
        ? process.env.STRIPE_PRO_YEARLY_PRICE_ID
        : process.env.STRIPE_PRO_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured" },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    let customerId = profile?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      await db
        .update(profiles)
        .set({ stripeCustomerId: customerId })
        .where(eq(profiles.id, user.id));
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${getAppUrl()}/dashboard?upgraded=true`,
      cancel_url: `${getAppUrl()}/pricing`,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
