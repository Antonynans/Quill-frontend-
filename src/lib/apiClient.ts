import axios, { AxiosInstance } from "axios";
import { ApiError, AuthError } from "@/types";
import { API_URL } from "@/store/constant";

class ApiClient {
  private client: AxiosInstance;

  private currentToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.currentToken) {
          config.headers.Authorization = `Bearer ${this.currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(this.handleError(error)),
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            if (!this.refreshPromise) {
              this.refreshPromise = this.performTokenRefresh();
            }
            const newToken = await this.refreshPromise;
            this.refreshPromise = null;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch {
            this.refreshPromise = null;
            this.handleTokenExpired();
            return Promise.reject(this.handleError(error));
          }
        }
        return Promise.reject(this.handleError(error));
      },
    );
  }

  setToken(token: string | null) {
    this.currentToken = token;
  }

  getToken(): string | null {
    return this.currentToken;
  }

  private async performTokenRefresh(): Promise<string> {
    const response = await fetch("/api/auth/refresh-token", { method: "POST" });
    if (!response.ok) throw new Error("Refresh failed");
    const data = await response.json();
    this.currentToken = data.access_token;
    return data.access_token;
  }

  private handleTokenExpired() {
    if (typeof window === "undefined") return;
    this.currentToken = null;
    fetch("/api/auth/clear-tokens", { method: "POST" }).finally(() => {
      window.location.href = "/auth/login";
    });
  }

  private handleError(error: any): AuthError {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.message || "An error occurred",
      detail: error.response?.data?.detail || error.response?.data?.message,
    };
    let code: AuthError["code"] = "UNKNOWN";
    if (apiError.status === 401) {
      code = apiError.detail?.includes("token")
        ? "TOKEN_EXPIRED"
        : "UNAUTHORIZED";
    } else if (
      apiError.status === 400 &&
      apiError.detail?.includes("already")
    ) {
      code = "EMAIL_ALREADY_EXISTS";
    }
    const authError = new Error(
      apiError.detail || apiError.message,
    ) as AuthError;
    authError.status = apiError.status;
    authError.code = code;    
    return authError;
  }

  async get<T>(url: string, config = {}) {
    return (await this.client.get<T>(url, config)).data;
  }
  async post<T>(url: string, data = {}, config = {}) {
    return (await this.client.post<T>(url, data, config)).data;
  }
  async patch<T>(url: string, data = {}, config = {}) {
    return (await this.client.patch<T>(url, data, config)).data;
  }
  async put<T>(url: string, data = {}, config = {}) {
    return (await this.client.put<T>(url, data, config)).data;
  }
  async delete<T>(url: string, config = {}) {
    return (await this.client.delete<T>(url, config)).data;
  }
  getInstance() {
    return this.client;
  }
}

export const apiClient = new ApiClient(API_URL);
