import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!backendRes.ok) {
      const errResponse = NextResponse.json(
        { error: "Refresh failed" },
        { status: 401 },
      );
      errResponse.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
      errResponse.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
      return errResponse;
    }

    const data = await backendRes.json();
    const { access_token, expires_in } = data;
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      access_token,
      expires_in: expires_in ?? 3600,
    });

    response.cookies.set("auth_token", access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: expires_in ?? 3600,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
