import { User, AuthError } from "@/types";

export function getUserInitials(user: User | null): string {
  if (!user) return "";
  return user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function isTokenExpired(
  issuedAt: number,
  expiresIn: number,
  bufferSeconds: number = 60,
): boolean {
  const now = Math.floor(Date.now() / 1000);
  const expiryTime = issuedAt + expiresIn;
  return now >= expiryTime - bufferSeconds;
}

export function formatUserName(user: User | null): string {
  if (!user) return "User";
  return user.full_name || user.email.split("@")[0];
}

export function isEmailVerified(user: User | null): boolean {
  return user?.is_verified ?? false;
}

export function isAccountActive(user: User | null): boolean {
  return user?.is_active ?? false;
}

export function getUserAvatarUrl(user: User | null): string | null {
  return user?.avatar_url || null;
}

export function isAuthError(error: unknown): error is AuthError {
  return (
    error instanceof Error &&
    "status" in error &&
    "code" in error &&
    typeof (error as any).status === "number" &&
    typeof (error as any).code === "string"
  );
}

export function getErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    const errorMessages: Record<string, string> = {
      INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
      EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
      TOKEN_EXPIRED: "Your session has expired. Please log in again.",
      UNAUTHORIZED: "You are not authorized to perform this action.",
      UNKNOWN: "An unexpected error occurred. Please try again.",
    };
    return errorMessages[error.code] || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

export function parseJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function canAccessProtectedFeatures(user: User | null): boolean {
  return !!user && user.is_verified && user.is_active;
}

export function formatDate(date: string | null): string {
  if (!date) return "Never";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

export function isStrongPassword(password: string): {
  isStrong: boolean;
  feedback: string[];
} {
  const feedback: string[] = [];

  if (password.length < 8) {
    feedback.push("At least 8 characters required");
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("At least one uppercase letter required");
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("At least one lowercase letter required");
  }

  if (!/[0-9]/.test(password)) {
    feedback.push("At least one number required");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push("At least one special character required");
  }

  return {
    isStrong: feedback.length === 0,
    feedback,
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateCSRFToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function sanitizeInput(input: string): string {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}
