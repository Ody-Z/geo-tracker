// TODO: Re-enable when profiles table and auth are added back for pro weekly scans
// This route requires profiles table (removed in MVP) for pro user lookup.

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Weekly scans not available in current version" },
    { status: 501 }
  );
}
