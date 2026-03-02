// TODO: Re-enable when profiles table and auth are added back for pro billing flow
// This route requires profiles table (removed in MVP) and Stripe integration.

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Billing not available in current version" },
    { status: 501 }
  );
}
