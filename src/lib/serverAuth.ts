import { cookies } from "next/headers";
import { User } from "@/types";
import { API_URL } from "@/store/constant";

interface ServerAuthResult {
  user: User | null;
  accessToken: string | null;
}

export async function getServerUser(): Promise<ServerAuthResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("auth_token")?.value ?? null;
  const refreshToken = cookieStore.get("refresh_token")?.value ?? null;

  if (!accessToken && !refreshToken) {
    return { user: null, accessToken: null };
  }

  if (accessToken) {
    const user = await fetchMe(accessToken);
    if (user) return { user, accessToken };
  }

  if (refreshToken) {
    const newToken = await refreshAccessToken(refreshToken);
    if (newToken) {
      const user = await fetchMe(newToken);
      if (user) return { user, accessToken: newToken };
    }
  }

  return { user: null, accessToken: null };
}

async function fetchMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },

      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}
