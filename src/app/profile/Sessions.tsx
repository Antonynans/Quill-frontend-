"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { UserSession } from "@/types";

export function SessionsTab() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const [loggingOutSession, setLoggingOutSession] = useState<number | null>(
    null,
  );

  const {
    data: sessions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-sessions"],
    queryFn: authApi.getSessions,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: handleLogoutSession } = useMutation({
    mutationFn: (sessionId: number) => authApi.logoutSession(sessionId),
    onMutate: (sessionId) => setLoggingOutSession(sessionId),
    onSuccess: () => {
      setLoggingOutSession(null);
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
    },
    onError: (err: any) => {
      setLoggingOutSession(null);
      console.error("Failed to logout from session:", err);
    },
  });

  const { mutate: handleLogoutAll, isPending: isLoggingOutAll } = useMutation({
    mutationFn: authApi.logoutAllDevices,
    onSuccess: () => {
      logout();
      router.push("/auth/login");
    },
    onError: (err: any) => {
      console.error("Failed to logout from all devices:", err);
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const extractDeviceName = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown Browser";
  };

  const extractOSName = (userAgent: string) => {
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("iOS")) return "iOS";
    if (userAgent.includes("Android")) return "Android";
    return "Unknown OS";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Active Sessions
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Manage your login sessions across devices.
        </p>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-slate-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              Failed to load sessions. Please try again.
            </p>
          </div>
        )}

        {/* Sessions List */}
        {!isLoading && !error && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session: UserSession) => (
              <div
                key={session.id}
                className="flex items-start justify-between p-4 border border-slate-200/50 rounded-lg hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-slate-900">
                      {extractDeviceName(session.user_agent)} on{" "}
                      {extractOSName(session.user_agent)}
                    </p>
                    {session.device_name && (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {session.device_name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    IP Address: {session.ip_address}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.last_used_at
                      ? `Last active: ${formatDate(session.last_used_at)}`
                      : `Created: ${formatDate(session.created_at)}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    disabled={
                      loggingOutSession === session.id || isLoggingOutAll
                    }
                    className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loggingOutSession === session.id
                      ? "Logging out..."
                      : "Logout"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-600">No active sessions found.</p>
          </div>
        )}

        {/* Logout All Button */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={() => handleLogoutAll()}
            disabled={isLoggingOutAll}
            className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOutAll ? "Logging out..." : "Logout from All Devices"}
          </button>
          <p className="text-xs text-slate-500 mt-2 text-center">
            This will log you out from all devices and sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
