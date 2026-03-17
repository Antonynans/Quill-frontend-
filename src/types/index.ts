// User and Auth types
export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

// Note types
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
  created_at: string;
  updated_at: string;
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

// Store types
export interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  fetchUser: () => Promise<void>;
}

export interface NotesStore {
  notes: Note[];
  trash: Note[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  } | null;
  isLoading: boolean;
  fetchNotes: (
    search?: string,
    colour?: string,
    tag?: string,
    pinnedOnly?: boolean,
    sortBy?: string,
    sortOrder?: string,
  ) => Promise<void>;
  fetchTrash: (page?: number, pageSize?: number) => Promise<void>;
  createNote: (payload: CreateNotePayload) => Promise<Note>;
  updateNote: (id: number, payload: UpdateNotePayload) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  permanentDeleteNote: (id: number) => Promise<void>;
  restoreNote: (id: number) => Promise<Note>;
  togglePin: (id: number) => Promise<Note>;
  lockNote: (id: number, lockPassword?: string) => Promise<Note>;
  unlockNote: (id: number, lockPassword: string) => Promise<Note>;
  shareNote: (id: number) => Promise<Note>;
  unshareNote: (id: number) => Promise<Note>;
  setNotes: (notes: Note[]) => void;
  setTrash: (trash: Note[]) => void;
}
