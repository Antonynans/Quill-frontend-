"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/signup"];

  useEffect(() => {
    // Mark as hydrated after first render
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Don't redirect if on a public route or if not yet hydrated
    if (publicRoutes.includes(pathname) || !isHydrated) {
      return;
    }

    if (!token) {
      router.push("/auth/login");
    }
  }, [token, router, pathname, isHydrated]);

  // Show nothing while checking authentication on protected routes
  if (!isHydrated || (!token && !publicRoutes.includes(pathname))) {
    return null;
  }

  return <>{children}</>;
}

export default AuthWrapper;
