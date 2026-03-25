/**
 * User Types
 */
export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}

/**
 * Authentication Response Types
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SignupResponse {
  message: string;
  email: string;
}

export interface AuthResponse {
  message: string;
}

/**
 * Auth Error Types
 */
export interface ApiError {
  status: number;
  message: string;
  detail?: string;
  code?: string;
}

export interface AuthError extends Error {
  status: number;
  code: 'INVALID_CREDENTIALS' | 'EMAIL_ALREADY_EXISTS' | 'TOKEN_EXPIRED' | 'UNAUTHORIZED' | 'UNKNOWN';
}

/**
 * Auth State Type
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: AuthError | null;
}

/**
 * Note Types
 */
export interface Note {
  id: number;
  title: string;
  description: string;
  description_html: string;
  status: string;
  colour: string;
  is_pinned: boolean;
  position: number;
  is_locked: boolean;
  is_shared: boolean;
  share_token: string | null;
  tags: string[];
  reminder_at: string | null;
  reminder_sent: boolean;
  owner_id: number;
  edited_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CreateNotePayload {
  title: string;
  description: string;
  tags?: string[];
  colour?: string;
  reminder_at?: string;
}

export interface UpdateNotePayload {
  title?: string;
  description?: string;
  tags?: string[];
  colour?: string;
  reminder_at?: string;
  position?: number;
}

/**
 * API Request/Response
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}