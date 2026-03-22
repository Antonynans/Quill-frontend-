"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (publicRoutes.includes(pathname) || !isHydrated) return;
    if (!token) router.push("/auth/login");
  }, [token, router, pathname, isHydrated]);

  if (!isHydrated || (!token && !publicRoutes.includes(pathname))) {
    return null;
  }

  return <>{children}</>;
}

export default AuthWrapper;
