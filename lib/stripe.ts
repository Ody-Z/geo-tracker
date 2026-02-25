import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export const PLANS = {
  free: {
    name: "Free",
    brands: 0,
    queriesPerScan: 3,
    manualScansPerMonth: 1,
    historyDays: 7,
  },
  pro: {
    name: "Pro",
    brands: 5,
    queriesPerScan: 10,
    manualScansPerMonth: 4,
    historyMonths: 12,
    priceMonthly: 29,
    priceYearly: 249,
  },
} as const;
