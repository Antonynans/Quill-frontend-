import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value ?? null;
  return NextResponse.json({ access_token: token });
}
