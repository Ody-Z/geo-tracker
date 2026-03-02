// TODO: Re-enable when profiles table and auth are added back for pro billing flow
// This route requires profiles table (removed in MVP) and Stripe integration.

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Webhooks not available in current version" },
    { status: 501 }
  );
}
