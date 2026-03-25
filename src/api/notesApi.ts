import { apiClient } from "@/lib/apiClient";
import { Note, CreateNotePayload, UpdateNotePayload } from "@/types";

export interface PaginatedNotes {
  items: Note[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const notesApi = {
  fetchNotes: async (
    params: { page?: number; search?: string } = {},
  ): Promise<PaginatedNotes> => {
    const { page = 1, search = "" } = params;
    const response = await apiClient.get<PaginatedNotes>("/api/notes", {
      params: { page, page_size: 12, ...(search ? { search } : {}) },
    });
    return response;
  },

  fetchTrash: async (): Promise<PaginatedNotes> => {
    const response = await apiClient.get<PaginatedNotes>("/api/notes/trash", {
      params: { page: 1, page_size: 50 },
    });
    return response;
  },

  createNote: async (payload: CreateNotePayload): Promise<Note> => {
    const response = await apiClient.post<Note>("/api/notes", payload);
    return response;
  },

  updateNote: async (id: number, payload: UpdateNotePayload): Promise<Note> => {
    const response = await apiClient.patch<Note>(`/api/notes/${id}`, payload);
    return response;
  },

  deleteNote: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/notes/${id}`);
  },

  permanentDeleteNote: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/notes/${id}/permanent`);
  },

  restoreNote: async (id: number): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${id}/restore`);
    return response;
  },

  togglePin: async (id: number): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${id}/pin`);
    return response;
  },

  lockNote: async (id: number, lockPassword?: string): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${id}/lock`, {
      lock_password: lockPassword,
    });
    return response;
  },

  unlockNote: async (id: number, lockPassword: string): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${id}/unlock`, {
      lock_password: lockPassword,
    });
    return response;
  },

  shareNote: async (id: number): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${id}/share`);
    return response;
  },

  unshareNote: async (id: number): Promise<Note> => {
    const response = await apiClient.post<Note>(`/api/notes/${id}/unshare`);
    return response;
  },
};
