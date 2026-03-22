import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/store/constant";

let apiInstance: AxiosInstance | null = null;

export const getApiClient = (): AxiosInstance => {
  if (apiInstance) return apiInstance;

  apiInstance = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
  });

  apiInstance.interceptors.request.use(
    (config) => {
      const { token } = useAuthStore.getState();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error),
  );

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    },
  );

  return apiInstance;
};

export default getApiClient;
