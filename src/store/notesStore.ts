import { create } from "zustand";
import axios from "axios";
import { NotesStore, CreateNotePayload, UpdateNotePayload } from "@/types";
import { API_URL } from "./constant";

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [],
  trash: [],
  pagination: null,
  isLoading: false,

  setNotes: (notes) => set({ notes }),
  setTrash: (trash) => set({ trash }),

  fetchNotes: async (
    search?: string,
    colour?: string,
    tag?: string,
    pinnedOnly?: boolean,
    sortBy?: string,
    sortOrder?: string,
  ) => {
    set({ isLoading: true });
    try {
      const params: any = { page: 1, page_size: 10 };
      if (search) params.search = search;
      if (colour) params.colour = colour;
      if (tag) params.tag = tag;
      if (pinnedOnly) params.pinned_only = pinnedOnly;
      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.sort_order = sortOrder;

      const response = await axios.get(`${API_URL}/api/notes`, { params });
      const { items, total, page, page_size, total_pages } = response.data;
      set({
        notes: items,
        pagination: { total, page, page_size, total_pages },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTrash: async (page = 1, pageSize = 10) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/api/notes/trash`, {
        params: { page, page_size: pageSize },
      });
      const { items } = response.data;
      set({
        trash: items,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createNote: async (payload: CreateNotePayload) => {
    try {
      const response = await axios.post(`${API_URL}/api/notes`, payload);
      const newNote = response.data;
      set((state) => ({ notes: [...state.notes, newNote] }));
      return newNote;
    } catch (error) {
      throw error;
    }
  },

  updateNote: async (id: number, payload: UpdateNotePayload) => {
    try {
      const response = await axios.patch(`${API_URL}/api/notes/${id}`, payload);
      const updatedNote = response.data;
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? updatedNote : note)),
      }));
      return updatedNote;
    } catch (error) {
      throw error;
    }
  },

  deleteNote: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/notes/${id}`);
      set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
    } catch (error) {
      throw error;
    }
  },

  permanentDeleteNote: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/notes/${id}/permanent`);
      set((state) => ({ trash: state.trash.filter((note) => note.id !== id) }));
    } catch (error) {
      throw error;
    }
  },

  restoreNote: async (id: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/notes/${id}/restore`);
      const restoredNote = response.data;
      set((state) => ({
        trash: state.trash.filter((note) => note.id !== id),
        notes: [...state.notes, restoredNote],
      }));
      return restoredNote;
    } catch (error) {
      throw error;
    }
  },

  togglePin: async (id: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/notes/${id}/pin`);
      const pinnedNote = response.data;
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? pinnedNote : note)),
      }));
      return pinnedNote;
    } catch (error) {
      throw error;
    }
  },

  lockNote: async (id: number, lockPassword?: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/notes/${id}/lock`, {
        lock_password: lockPassword,
      });
      const lockedNote = response.data;
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? lockedNote : note)),
      }));
      return lockedNote;
    } catch (error) {
      throw error;
    }
  },

  unlockNote: async (id: number, lockPassword: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/notes/${id}/unlock`, {
        lock_password: lockPassword,
      });
      const unlockedNote = response.data;
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? unlockedNote : note,
        ),
      }));
      return unlockedNote;
    } catch (error) {
      throw error;
    }
  },

  shareNote: async (id: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/notes/${id}/share`);
      const sharedNote = response.data;
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? sharedNote : note)),
      }));
      return sharedNote;
    } catch (error) {
      throw error;
    }
  },

  unshareNote: async (id: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/notes/${id}/unshare`);
      const unsharedNote = response.data;
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? unsharedNote : note,
        ),
      }));
      return unsharedNote;
    } catch (error) {
      throw error;
    }
  },
}));
