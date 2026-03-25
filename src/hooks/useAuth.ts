import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/authApi';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, AuthError } from '@/types';

export const authKeys = {
  all: ['auth'] as const,
  user: ['auth', 'user'] as const,
};

export function useCurrentUser() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user,
    queryFn: authApi.fetchMe,
    enabled: !!token,
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useLogin() {
  const { setAuth, setError, setLoading } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<User> => {
      const loginData = await authApi.login(email, password);
      const { access_token, refresh_token, expires_in } = loginData;

      const cookieRes = await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, refresh_token, expires_in }),
      });
      if (!cookieRes.ok) throw new Error('Failed to persist session');

      apiClient.setToken(access_token);

      const user = await authApi.fetchMe();
      setAuth(user, access_token);
      queryClient.setQueryData(authKeys.user, user);
      setError(null);
      return user;
    },

    onMutate: () => setLoading(true),

    onSuccess: () => {
      setLoading(false);
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    },

    onError: (error: AuthError) => {
      setLoading(false);
      setError(error);
    },
  });
}

export function useSignup() {
  const { setError } = useAuthStore();

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
    onError: (error: AuthError) => setError(error),
    onSuccess: () => setError(null),
  });
}

export function useVerifyEmail() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => setError(null),
    onError: (error: AuthError) => setError(error),
  });
}

export function useResendVerification() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onError: (error: AuthError) => setError(error),
    onSuccess: () => setError(null),
  });
}

export function useForgotPassword() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onError: (error: AuthError) => setError(error),
    onSuccess: () => setError(null),
  });
}

export function useResetPassword() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
    onError: (error: AuthError) => setError(error),
    onSuccess: () => setError(null),
  });
}

async function clearAuthState(
  logout: () => void,
  queryClient: ReturnType<typeof useQueryClient>,
  router: ReturnType<typeof useRouter>,
) {
  await fetch('/api/auth/clear-tokens', { method: 'POST' });
  apiClient.setToken(null);
  logout();
  queryClient.clear();
  router.push('/auth/login');
}

export function useLogout() {
  const { logout, setError } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => { clearAuthState(logout, queryClient, router); setError(null); },
    onError: (error: AuthError) => { clearAuthState(logout, queryClient, router); setError(error); },
  });
}

export function useLogoutAllDevices() {
  const { logout, setError } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logoutAllDevices(),
    onSuccess: () => { clearAuthState(logout, queryClient, router); setError(null); },
    onError: (error: AuthError) => { clearAuthState(logout, queryClient, router); setError(error); },
  });
}

export function useUpdateProfile() {
  const { setUser, setError } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fullName, bio }: { fullName: string; bio: string | null }) =>
      authApi.updateProfile(fullName, bio),
    onSuccess: (data: User) => {
      setUser(data);
      queryClient.setQueryData(authKeys.user, data);
      setError(null);
    },
    onError: (error: AuthError) => setError(error),
  });
}

export function useUploadAvatar() {
  const { setUser, setError } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: (data: User) => {
      setUser(data);
      queryClient.setQueryData(authKeys.user, data);
      setError(null);
    },
    onError: (error: AuthError) => setError(error),
  });
}

export function useChangePassword() {
  const { logout, setError } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => { clearAuthState(logout, queryClient, router); setError(null); },
    onError: (error: AuthError) => setError(error),
  });
}
