import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { access_token, refresh_token, expires_in } = await request.json();

  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
  }

  const isProduction = process.env.NODE_ENV === "production";
  const cookieBase = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    path: "/",
  };

  const response = NextResponse.json({ ok: true });

  response.cookies.set("auth_token", access_token, {
    ...cookieBase,
    maxAge: expires_in ?? 3600,
  });

  response.cookies.set("refresh_token", refresh_token, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
