import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { AuthStore } from "@/types";
import { API_URL } from "./constant";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      fetchUser: async () => {
        try {
          const response = await axios.get(`${API_URL}/api/auth/me`);
          set({ user: response.data, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch user:", error);
          set({ user: null, isLoading: false });
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password,
          });
          const { access_token } = response.data;
          set({ token: access_token });
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${access_token}`;
         
          const userResponse = await axios.get(`${API_URL}/api/auth/me`);
          set({ user: userResponse.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_URL}/api/auth/signup`, {
            email,
            password,
          });
          const { access_token } = response.data;
          set({ token: access_token });
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${access_token}`;
         
          const userResponse = await axios.get(`${API_URL}/api/auth/me`);
          set({ user: userResponse.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        delete axios.defaults.headers.common["Authorization"];
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
       
        if (state?.token) {
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${state.token}`;
         
          axios
            .get(`${API_URL}/api/auth/me`)
            .then((response) => {
              state.setUser(response.data);
            })
            .catch((error) => {
              console.error("Failed to fetch user on rehydration:", error);
             
              state.logout();
            });
        }
      },
    },
  ),
);
