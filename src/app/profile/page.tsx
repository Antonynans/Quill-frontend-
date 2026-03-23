'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { useCurrentUser } from '@/hooks/useAuth';
import {
  LuAlertCircle,
  LuArrowRight,
  LuCamera,
  LuCheckCircle2,
  LuEye,
  LuEyeOff,
  LuLoader,
} from 'react-icons/lu';
import { Header } from '@/components/Header';
import { TrashModal } from '@/components/TrashModal';
import { toast } from 'react-toastify';

interface FormState {
  fullName: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const [tab, setTab] = useState<'profile' | 'setting' | 'sessions'>('profile');
  const [formState, setFormState] = useState<FormState>({
    fullName: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  // Handle hash routing for tab navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove '#' from hash
    if (hash === 'setting' || hash === 'profile' || hash === 'sessions') {
      setTab(hash as 'profile' | 'setting' | 'sessions');
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFormState((prev) => ({
        ...prev,
        fullName: currentUser.full_name || '',
        bio: currentUser.bio || '',
      }));
    }
  }, [currentUser]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { full_name: string; bio: string | null }) =>
      authApi.updateProfile(data.full_name, data.bio),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Update was not successful');
    },
  });

  // Avatar Upload Mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => authApi.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data);
      toast.success('Avatar updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to upload avatar';
      toast.error(message);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      current_password: string;
      new_password: string;
    }) => authApi.changePassword(data.current_password, data.new_password),
    onSuccess: () => {
      setFormState({
        fullName: formState.fullName,
        bio: formState.bio,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
      toast.success('Password changed! Please log in again');
      setTimeout(() => {
        logout();
        router.push('/auth/login');
      }, 2000);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail;
      toast.error(message || 'Failed to change password');
    },
  });

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPEG and PNG images allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    uploadAvatarMutation.mutate(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      full_name: formState.fullName,
      bio: formState.bio || null,
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.newPassword !== formState.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formState.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    changePasswordMutation.mutate({
      current_password: formState.currentPassword,
      new_password: formState.newPassword,
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
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

  return (
    <div className="min-h-screen overflow-visible">
      <Header onTrashClick={() => setIsTrashOpen(true)} />
      <main className="container mx-auto px-4 py-8 md:py-10 overflow-visible">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Account Settings
          </h1>
          <p className="text-slate-600 mt-1">Manage your profile and setting</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200/50 overflow-hidden sticky top-24">
                {[
                  { id: 'profile', label: 'Profile' },
                  { id: 'setting', label: 'Setting' },
                  { id: 'sessions', label: 'Sessions' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTab(item.id as any);
                      // Update URL hash
                      window.location.hash = item.id;
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-200/50 last:border-b-0 font-medium transition-all ${
                      tab === item.id
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 space-y-6">
              {/* Profile Tab */}
              {tab === 'profile' && (
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">
                      Profile Photo
                    </h2>
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {displayUser.avatar_url ? (
                            <img
                              src={displayUser.avatar_url}
                              alt={displayUser.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-white">
                              {displayUser.full_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={handleAvatarClick}
                          disabled={uploadAvatarMutation.isPending}
                          className="absolute bottom-0 right-0 bg-white border-2 border-slate-200 rounded-full p-2 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                        >
                          {uploadAvatarMutation.isPending ? (
                            <LuLoader className="w-4 h-4 animate-spin text-slate-600" />
                          ) : (
                            <LuCamera className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 mb-3">
                          JPG or PNG, max 5MB. Recommended: square image.
                        </p>
                        <button
                          onClick={handleAvatarClick}
                          disabled={uploadAvatarMutation.isPending}
                          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                          {uploadAvatarMutation.isPending
                            ? 'Uploading...'
                            : 'Upload Photo'}
                        </button>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  {/* Profile Information */}
                  <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">
                      Basic Information
                    </h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={displayUser.email}
                          disabled
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Email cannot be changed. Contact support if you need
                          help.
                        </p>
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formState.fullName}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={formState.bio}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          placeholder="Tell us about yourself..."
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                          rows={4}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Max 500 characters. Optional.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <LuLoader className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            Save Changes
                            <LuArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Setting Tab */}
              {tab === 'setting' && (
                <div className="space-y-6" id="setting">
                  <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">
                      Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-5">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={
                              formState.showCurrentPassword
                                ? 'text'
                                : 'password'
                            }
                            value={formState.currentPassword}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormState((prev) => ({
                                ...prev,
                                showCurrentPassword: !prev.showCurrentPassword,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                          >
                            {formState.showCurrentPassword ? (
                              <LuEyeOff className="w-4 h-4" />
                            ) : (
                              <LuEye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={
                              formState.showNewPassword ? 'text' : 'password'
                            }
                            value={formState.newPassword}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormState((prev) => ({
                                ...prev,
                                showNewPassword: !prev.showNewPassword,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                          >
                            {formState.showNewPassword ? (
                              <LuEyeOff className="w-4 h-4" />
                            ) : (
                              <LuEye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          At least 8 characters. Use a mix of upper, lower,
                          numbers, and symbols.
                        </p>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={
                              formState.showConfirmPassword
                                ? 'text'
                                : 'password'
                            }
                            value={formState.confirmPassword}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormState((prev) => ({
                                ...prev,
                                showConfirmPassword: !prev.showConfirmPassword,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                          >
                            {formState.showConfirmPassword ? (
                              <LuEyeOff className="w-4 h-4" />
                            ) : (
                              <LuEye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

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
                          'Update Password'
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Account Status */}
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
              )}

              {/* Sessions Tab */}
              {tab === 'sessions' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">
                      Active Sessions
                    </h2>
                    <p className="text-slate-600 text-sm mb-6">
                      Manage your login sessions across devices.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200/50 rounded-lg bg-orange-50">
                        <div>
                          <p className="font-medium text-slate-900">
                            This Device
                          </p>
                          <p className="text-sm text-slate-600">
                            Current session • Active now
                          </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        Logout from All Devices
                      </button>
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        This will log you out from all devices and sessions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <TrashModal isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />
    </div>
  );
}