"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import {
  LuCheckCircle2,
  LuEye,
  LuEyeOff,
  LuLoader,
} from "react-icons/lu";
import { toast } from "react-toastify";

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

export function ChangePasswordTab() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [formState, setFormState] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      current_password: string;
      new_password: string;
    }) => authApi.changePassword(data.current_password, data.new_password),
    onSuccess: () => {
      setFormState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
      toast.success("Password changed! Please log in again");
      setTimeout(() => {
        logout();
        router.push("/auth/login");
      }, 2000);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail;
      toast.error(message || "Failed to change password");
    },
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.newPassword !== formState.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formState.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    changePasswordMutation.mutate({
      current_password: formState.currentPassword,
      new_password: formState.newPassword,
    });
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    showPassword: boolean,
    onToggleShow: () => void,
    showHint: boolean = false
  ) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
        >
          {showPassword ? (
            <LuEyeOff className="w-4 h-4" />
          ) : (
            <LuEye className="w-4 h-4" />
          )}
        </button>
      </div>
      {showHint && (
        <p className="text-xs text-slate-500 mt-1">
          At least 8 characters. Use a mix of upper, lower, numbers, and symbols.
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6" id="change_password">
      <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-5">
          {renderPasswordInput(
            "Current Password",
            formState.currentPassword,
            (value) =>
              setFormState((prev) => ({ ...prev, currentPassword: value })),
            formState.showCurrentPassword,
            () =>
              setFormState((prev) => ({
                ...prev,
                showCurrentPassword: !prev.showCurrentPassword,
              }))
          )}

          {renderPasswordInput(
            "New Password",
            formState.newPassword,
            (value) => setFormState((prev) => ({ ...prev, newPassword: value })),
            formState.showNewPassword,
            () =>
              setFormState((prev) => ({
                ...prev,
                showNewPassword: !prev.showNewPassword,
              })),
            true
          )}

          {renderPasswordInput(
            "Confirm Password",
            formState.confirmPassword,
            (value) =>
              setFormState((prev) => ({ ...prev, confirmPassword: value })),
            formState.showConfirmPassword,
            () =>
              setFormState((prev) => ({
                ...prev,
                showConfirmPassword: !prev.showConfirmPassword,
              }))
          )}

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {changePasswordMutation.isPending ? (
              <>
                <LuLoader className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Account Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Email Verified</span>
            <span className="inline-flex items-center gap-2 text-emerald-700 font-medium">
              <LuCheckCircle2 className="w-4 h-4" />
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}