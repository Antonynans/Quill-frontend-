import { format, formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "MMM d, yyyy");
  } catch {
    return "Invalid date";
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "MMM d, yyyy HH:mm");
  } catch {
    return "Invalid date";
  }
};

export const formatTimeAgo = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return "Invalid date";
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const getInitials = (email: string): string => {
  const parts = email.split("@")[0].split(/[._-]/);
  return parts
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .substring(0, 2);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
