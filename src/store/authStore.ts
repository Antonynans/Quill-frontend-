import { create } from "zustand";
import { User, AuthError } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,

  setAuth: (user, token) => set({ user, token, error: null, isLoading: false }),

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  logout: () => set({ token: null, user: null, error: null, isLoading: false }),
}));

export const useAuthStatus = () =>
  useAuthStore((state) => ({
    isAuthenticated: !!state.token && !!state.user,
    user: state.user,
    isLoading: state.isLoading,
    token: state.token,
  }));
