import axios from "axios";
import { User } from "@/types";
import { API_URL } from "@/store/constant";


export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data as { access_token: string; refresh_token: string };
  },

  signup: async (email: string, password: string, fullName?: string) => {
    const response = await axios.post(`${API_URL}/api/auth/signup`, {
      email,
      password,
      full_name: fullName || "",
    });
    return response.data;
  },

  fetchMe: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/api/auth/me`);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axios.get(`${API_URL}/api/auth/verify-email`, {
      params: { token },
    });
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await axios.post(
      `${API_URL}/api/auth/resend-verification`,
      { email },
    );
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
      email,
    });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
      token,
      new_password: newPassword,
    });
    return response.data;
  },
};
