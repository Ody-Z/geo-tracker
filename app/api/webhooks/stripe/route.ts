import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId && session.subscription) {
        await db
          .update(profiles)
          .set({
            plan: "pro",
            stripeSubscriptionId: session.subscription as string,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, userId));
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.stripeCustomerId, customerId),
      });

      if (profile) {
        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        await db
          .update(profiles)
          .set({
            plan: isActive ? "pro" : "free",
            stripeSubscriptionId: subscription.id,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profile.id));
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.stripeCustomerId, customerId),
      });

      if (profile) {
        await db
          .update(profiles)
          .set({
            plan: "free",
            stripeSubscriptionId: null,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profile.id));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
