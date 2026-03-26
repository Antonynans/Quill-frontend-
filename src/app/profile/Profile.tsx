"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useAuth";
import { LuCamera, LuLoader, LuAlertCircle, LuPencil } from "react-icons/lu";
import { toast } from "react-toastify";
import { authApi } from "@/api/authApi";

interface ProfileFormState {
  fullName: string;
  bio: string;
}

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formState, setFormState] = useState<ProfileFormState>({
    fullName: "",
    bio: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormState({
        fullName: currentUser.full_name || "",
        bio: currentUser.bio || "",
      });
      if (currentUser.avatar_url) {
        setProfileImage(currentUser.avatar_url);
      }
    }
  }, [currentUser]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        body: data,
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to update profile";
      toast.error(message);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => authApi.uploadAvatar(file),
    onSuccess: (data) => {
      setProfileImage(data.avatar_url || null);
      queryClient.setQueryData(["auth", "user"], data);
      toast.success("Avatar updated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to upload avatar";
      toast.error(message);
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    uploadAvatarMutation.mutate(file);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", formState.fullName);
    formData.append("bio", formState.bio);

    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormState({
        fullName: currentUser.full_name || "",
        bio: currentUser.bio || "",
      });
    }
    setIsEditing(false);
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LuLoader className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <LuAlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-slate-600">Failed to load profile information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Profile Picture
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {currentUser.full_name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatarMutation.isPending}
              className="absolute bottom-0 right-0 p-2 bg-orange-600 rounded-full text-white hover:bg-orange-700 transition-colors disabled:opacity-50"
              title="Change profile picture"
            >
              <LuCamera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600 mb-2">
              Recommended: Square image, at least 400x400px
            </p>
            <p className="text-xs text-slate-500">
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </p>
            {uploadAvatarMutation.isPending && (
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                <LuLoader className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/50 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors flex items-center gap-1"
            >
              <LuPencil />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-5">
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
                placeholder="Enter your full name"
              />
            </div>

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
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
              <p className="text-xs text-slate-500 mt-1">
                {formState.bio.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <LuLoader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <p className="text-slate-600">
                {formState.fullName || "Not set"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <p className="text-slate-600">{currentUser.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bio
              </label>
              <p className="text-slate-600 whitespace-pre-wrap">
                {formState.bio || "No bio added yet"}
              </p>
            </div>

            {currentUser.created_at && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Member Since
                </label>
                <p className="text-slate-600">
                  {new Date(currentUser.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
