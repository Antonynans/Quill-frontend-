"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import { authKeys } from "@/hooks/useAuth";
import { User } from "@/types";

interface AuthProviderProps {
  initialUser: User | null;
  initialToken: string | null;
  children: React.ReactNode;
}

export function AuthProvider({
  initialUser,
  initialToken,
  children,
}: AuthProviderProps) {
  const { setAuth, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const seeded = useRef(false);

  if (!seeded.current) {
    seeded.current = true;
    if (initialUser && initialToken) {
      apiClient.setToken(initialToken);
      setAuth(initialUser, initialToken);
      queryClient.setQueryData(authKeys.user, initialUser);
    } else {
      logout();
    }
  }

  useEffect(() => {
    if (initialToken) apiClient.setToken(initialToken);
  }, [initialToken]);

  return <>{children}</>;
}
