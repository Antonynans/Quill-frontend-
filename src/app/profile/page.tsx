"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCurrentUser } from "@/hooks/useAuth";
import { LuAlertCircle, LuLoader } from "react-icons/lu";
import { Header } from "@/components/Header";
import { TrashModal } from "@/components/TrashModal";
import Profile from "./Profile";
import { ChangePasswordTab } from "./ChangePassword";
import { SessionsTab } from "./Sessions";

export default function ProfileSettingsPage() {
  const { user } = useAuthStore();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const [tab, setTab] = useState<"profile" | "change_password" | "sessions">(
    "profile",
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (
      hash === "change_password" ||
      hash === "profile" ||
      hash === "sessions"
    ) {
      setTab(hash as "profile" | "change_password" | "sessions");
    }
  }, []);

  const handleTabChange = (
    newTab: "profile" | "change_password" | "sessions",
  ) => {
    setTab(newTab);
    window.location.hash = newTab;
  };

  const displayUser = currentUser || user;

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LuLoader className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LuAlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-slate-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "change_password", label: "Change Password" },
    { id: "sessions", label: "Sessions" },
  ] as const;

  return (
    <div className="min-h-screen overflow-visible">
      <Header onTrashClick={() => setIsTrashOpen(true)} />
      <main className="container mx-auto px-4 py-8 md:py-10 overflow-visible">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Account Settings
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your profile and password
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200/50 overflow-hidden sticky top-24">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-200/50 last:border-b-0 font-medium transition-all ${
                      tab === item.id
                        ? "bg-orange-50 text-orange-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              {tab === "profile" && <Profile />}
              {tab === "change_password" && <ChangePasswordTab />}
              {tab === "sessions" && <SessionsTab />}
            </div>
          </div>
        </div>
      </main>
      <TrashModal isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />
    </div>
  );
}
