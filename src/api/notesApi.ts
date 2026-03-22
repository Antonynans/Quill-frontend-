import axios from "axios";
import { Note, CreateNotePayload, UpdateNotePayload } from "@/types";
import { API_URL } from "@/store/constant";

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
    const response = await axios.get(`${API_URL}/api/notes`, {
      params: { page, page_size: 12, ...(search ? { search } : {}) },
    });
    return response.data;
  },

  fetchTrash: async (): Promise<PaginatedNotes> => {
    const response = await axios.get(`${API_URL}/api/notes/trash`, {
      params: { page: 1, page_size: 50 },
    });
    return response.data;
  },

  createNote: async (payload: CreateNotePayload): Promise<Note> => {
    const response = await axios.post(`${API_URL}/api/notes`, payload);
    return response.data;
  },

  updateNote: async (id: number, payload: UpdateNotePayload): Promise<Note> => {
    const response = await axios.patch(`${API_URL}/api/notes/${id}`, payload);
    return response.data;
  },

  deleteNote: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/notes/${id}`);
  },

  permanentDeleteNote: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/notes/${id}/permanent`);
  },

  restoreNote: async (id: number): Promise<Note> => {
    const response = await axios.post(`${API_URL}/api/notes/${id}/restore`);
    return response.data;
  },

  togglePin: async (id: number): Promise<Note> => {
    const response = await axios.post(`${API_URL}/api/notes/${id}/pin`);
    return response.data;
  },

  lockNote: async (id: number, lockPassword?: string): Promise<Note> => {
    const response = await axios.post(`${API_URL}/api/notes/${id}/lock`, {
      lock_password: lockPassword,
    });
    return response.data;
  },

  unlockNote: async (id: number, lockPassword: string): Promise<Note> => {
    const response = await axios.post(`${API_URL}/api/notes/${id}/unlock`, {
      lock_password: lockPassword,
    });
    return response.data;
  },

  shareNote: async (id: number): Promise<Note> => {
    const response = await axios.post(`${API_URL}/api/notes/${id}/share`);
    return response.data;
  },

  unshareNote: async (id: number): Promise<Note> => {
    const response = await axios.post(`${API_URL}/api/notes/${id}/unshare`);
    return response.data;
  },
};
