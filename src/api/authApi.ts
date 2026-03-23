// api/authApi.ts
import axios from "axios";
import type { User } from "@/types";
import { API_URL } from "@/store/constant";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface PasswordResetResponse {
  message: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  signup: async (
    email: string,
    password: string,
    fullName?: string,
  ): Promise<{ message: string; email: string }> => {
    const response = await client.post("/api/auth/signup", {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const response = await client.get<VerifyEmailResponse>(
      "/api/auth/verify-email",
      {
        params: { token },
      },
    );
    return response.data;
  },

  resendVerification: async (email: string): Promise<VerifyEmailResponse> => {
    const response = await client.post<VerifyEmailResponse>(
      "/api/auth/resend-verification",
      { email },
    );
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await client.post<RefreshTokenResponse>(
      "/api/auth/refresh",
      {
        refresh_token: refreshToken,
      },
    );
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await client.post<{ message: string }>("/api/auth/logout");
    return response.data;
  },

  logoutAllDevices: async (): Promise<{ message: string }> => {
    const response = await client.post<{ message: string }>(
      "/api/auth/logout-all",
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await client.post<{ message: string }>(
      "/api/auth/forgot-password",
      { email },
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<PasswordResetResponse> => {
    const response = await client.post<PasswordResetResponse>(
      "/api/auth/reset-password",
      {
        token,
        new_password: newPassword,
      },
    );
    return response.data;
  },

  fetchMe: async (): Promise<User> => {
    const response = await client.get<User>("/api/auth/me");
    return response.data;
  },

  updateProfile: async (
    fullName: string,
    bio: string | null,
  ): Promise<User> => {
    const response = await client.patch<User>("/api/auth/me", {
      full_name: fullName,
      bio: bio || null,
    });
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await client.post<User>("/api/auth/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const response = await client.post<{ message: string }>(
      "/api/auth/me/change-password",
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
    );
    return response.data;
  },
};
