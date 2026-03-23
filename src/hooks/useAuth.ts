import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const authKeys = {
  user: ["auth", "user"] as const,
};

export function useCurrentUser() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user,
    queryFn: authApi.fetchMe,
    enabled: !!token,
    staleTime: 1000 * 60,
    retry: false,
  });
}

export function useLogin() {
  const { setToken, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),

    onSuccess: async (data) => {
      const { access_token } = data;

      setToken(access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      const user = await authApi.fetchMe();
      setUser(user);
      queryClient.setQueryData(authKeys.user, user);
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName?: string;
    }) => authApi.signup(email, password, fullName),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => authApi.resetPassword(token, newPassword),
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    delete axios.defaults.headers.common["Authorization"];
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fullName, bio }: { fullName: string; bio: string | null }) =>
      authApi.updateProfile(fullName, bio),

    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),

    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data);
    },
  });
}

export function useChangePassword() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authApi.changePassword(currentPassword, newPassword),

    onSuccess: () => {
      logout();
      queryClient.clear();
      delete axios.defaults.headers.common["Authorization"];
    },
  });
}

export function useLogoutAllDevices() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logoutAllDevices(),

    onSuccess: () => {
      logout();
      queryClient.clear();
      delete axios.defaults.headers.common["Authorization"];
    },
  });
}

export function useRefreshToken() {
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),

    onSuccess: (data) => {
      const { access_token } = data;
      setToken(access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    },
  });
}
