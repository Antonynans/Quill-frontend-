export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
}

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
