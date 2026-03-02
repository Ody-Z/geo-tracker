// TODO: Re-enable when profiles table and auth are added back for pro brand management
// This route requires auth and profiles table (removed in MVP).

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  return NextResponse.json(
    { error: "Brand management not available in current version" },
    { status: 501 }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  return NextResponse.json(
    { error: "Brand management not available in current version" },
    { status: 501 }
  );
}
