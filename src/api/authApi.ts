import { apiClient } from "@/lib/apiClient";
import { User, LoginResponse, UserSession } from "@/types";

export const authApi = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>("/api/auth/login", { email, password }),

  fetchMe: (): Promise<User> => apiClient.get<User>("/api/auth/me"),

  signup: (
    email: string,
    password: string,
    fullName?: string,
  ): Promise<{ message: string; email: string }> =>
    apiClient.post("/api/auth/signup", {
      email,
      password,
      full_name: fullName,
    }),

  verifyEmail: (token: string): Promise<{ message: string }> =>
    apiClient.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),

  resendVerification: (email: string): Promise<{ message: string }> =>
    apiClient.post("/api/auth/resend-verification", { email }),

  forgotPassword: (email: string): Promise<{ message: string }> =>
    apiClient.post("/api/auth/forgot-password", { email }),

  resetPassword: (
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> =>
    apiClient.post("/api/auth/reset-password", {
      token,
      new_password: newPassword,
    }),

  logout: (): Promise<{ message: string }> =>
    apiClient.post("/api/auth/logout", {}),

  logoutAllDevices: (): Promise<{ message: string }> =>
    apiClient.post("/api/auth/logout-all", {}),

  getSessions: (): Promise<UserSession[]> =>
    apiClient.get<UserSession[]>("/api/auth/sessions"),

  logoutSession: (sessionId: number): Promise<{ message: string }> =>
    apiClient.post(`/api/auth/sessions/${sessionId}/logout`, {}),

  updateProfile: (fullName: string, bio: string | null): Promise<User> =>
    apiClient.patch<User>("/api/auth/me", { full_name: fullName, bio }),

  uploadAvatar: (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<User>("/api/auth/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  changePassword: (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> =>
    apiClient.post("/api/auth/me/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    }),
};
