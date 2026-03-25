import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60, // 1 hour for access token
  });
}

export async function setRefreshToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("refresh_token", token, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  return token?.value || null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh_token");
  return token?.value || null;
}

export async function clearAuthTokens() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("refresh_token");
}

export async function clearCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return !!token;
}
