import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { notesApi, PaginatedNotes } from "@/api/notesApi";
import { Note, CreateNotePayload, UpdateNotePayload } from "@/types";
import { toast } from "react-toastify";

export const noteKeys = {
  all: ["notes"] as const,
  lists: () => [...noteKeys.all, "list"] as const,
  list: (search: string) => [...noteKeys.lists(), { search }] as const,
  trash: () => [...noteKeys.all, "trash"] as const,
};

function patchNoteInPages(
  old: InfiniteData<PaginatedNotes> | undefined,
  updatedNote: Note,
): InfiniteData<PaginatedNotes> | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      items: page.items.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
    })),
  };
}

export function useNotes(search: string = "") {
  return useInfiniteQuery({
    queryKey: noteKeys.list(search),
    queryFn: ({ pageParam = 1 }) =>
      notesApi.fetchNotes({ page: pageParam as number, search }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: true,
  });
}

export function useTrash() {
  return useQuery({
    queryKey: noteKeys.trash(),
    queryFn: notesApi.fetchTrash,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNotePayload) => notesApi.createNote(payload),

    onSuccess: (newNote) => {
      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                items: [newNote, ...old.pages[0].items],
                total: old.pages[0].total + 1,
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );
    },

    onError: () => toast.error("Failed to create note"),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateNotePayload }) =>
      notesApi.updateNote(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.lists() });
      const snapshots = queryClient.getQueriesData<
        InfiniteData<PaginatedNotes>
      >({
        queryKey: noteKeys.lists(),
      });

      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) =>
                n.id === id ? { ...n, ...payload } : n,
              ),
            })),
          };
        },
      );

      return { snapshots };
    },

    onError: (_err, _vars, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error("Failed to update note");
    },

    onSuccess: (updatedNote) => {
      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => patchNoteInPages(old, updatedNote),
      );
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notesApi.deleteNote(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.lists() });
      const snapshots = queryClient.getQueriesData<
        InfiniteData<PaginatedNotes>
      >({
        queryKey: noteKeys.lists(),
      });

      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((n) => n.id !== id),
              total: page.total - 1,
            })),
          };
        },
      );

      return { snapshots };
    },

    onError: (_err, _id, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error("Failed to delete note");
    },
  });
}

export function useTogglePin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notesApi.togglePin(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.lists() });
      const snapshots = queryClient.getQueriesData<
        InfiniteData<PaginatedNotes>
      >({
        queryKey: noteKeys.lists(),
      });

      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) =>
                n.id === id ? { ...n, is_pinned: !n.is_pinned } : n,
              ),
            })),
          };
        },
      );

      return { snapshots };
    },

    onError: (_err, _id, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error("Failed to pin note");
    },

    onSuccess: (updatedNote) => {
      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => patchNoteInPages(old, updatedNote),
      );
    },
  });
}

export function useLockNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, lockPassword }: { id: number; lockPassword?: string }) =>
      notesApi.lockNote(id, lockPassword),

    onSuccess: (updatedNote) => {
      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => patchNoteInPages(old, updatedNote),
      );
    },

    onError: () => toast.error("Failed to lock note"),
  });
}

export function useUnlockNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, lockPassword }: { id: number; lockPassword: string }) =>
      notesApi.unlockNote(id, lockPassword),

    onSuccess: (updatedNote) => {
      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => patchNoteInPages(old, updatedNote),
      );
    },

    onError: () => toast.error("Failed to unlock note"),
  });
}

export function useShareNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notesApi.shareNote(id),
    onSuccess: (updatedNote) => {
      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => patchNoteInPages(old, updatedNote),
      );
    },
    onError: () => toast.error("Failed to share note"),
  });
}

export function useUnshareNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notesApi.unshareNote(id),
    onSuccess: (updatedNote) => {
      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => patchNoteInPages(old, updatedNote),
      );
    },
    onError: () => toast.error("Failed to unshare note"),
  });
}

export function usePermanentDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notesApi.permanentDeleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.trash() });
    },
    onError: () => toast.error("Failed to permanently delete note"),
  });
}

export function useRestoreNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notesApi.restoreNote(id),
    onSuccess: (restoredNote) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.trash() });

      queryClient.setQueriesData<InfiniteData<PaginatedNotes>>(
        { queryKey: noteKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                items: [restoredNote, ...old.pages[0].items],
                total: old.pages[0].total + 1,
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );
    },
    onError: () => toast.error("Failed to restore note"),
  });
}

export function useReorderNotes() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (reordered: { id: number; position: number }[]) => {
      for (const item of reordered) {
        await notesApi.updateNote(item.id, { position: item.position });
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
      toast.error("Failed to update note order");
    },
  });

  return mutation;
}
