"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useNotes, useReorderNotes } from "@/hooks/useNotes";
import { Header } from "@/components/Header";
import { NoteModal } from "@/components/NoteModal";
import { TrashModal } from "@/components/TrashModal";
import { SortableNoteCard } from "@/components/SortableNoteCard";
import { SearchBar } from "@/components/Searchbar";
import { Note } from "@/types";
import { FiPlus } from "react-icons/fi";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { NoteCard } from "@/components/NoteCard";

export default function Home() {
  const { token } = useAuthStore();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [draggedNote, setDraggedNote] = useState<Note | null>(null);
  const [localNotes, setLocalNotes] = useState<Note[]>([]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isDraggingRef = useRef(false);
  const isSavingOrderRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useNotes(searchQuery);

  const { mutateAsync: reorderNotes } = useReorderNotes();

  const allNotes = data?.pages.flatMap((page) => page.items) ?? [];
  const totalNotes = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    if (!isDraggingRef.current && !isSavingOrderRef.current) {
      setLocalNotes(allNotes);
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const reObserve = useCallback(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    if (observerRef.current) observerRef.current.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px", threshold: 0 },
    );
    observer.observe(sentinel);
    observerRef.current = observer;
  }, [loadMore]);

  useEffect(() => {
    reObserve();
    return () => observerRef.current?.disconnect();
  }, [reObserve]);

  useEffect(() => {
    if (!isFetchingNextPage) setTimeout(() => reObserve(), 100);
  }, [isFetchingNextPage, reObserve]);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDragStart = (event: DragEndEvent) => {
    isDraggingRef.current = true;
    const item = localNotes.find((n) => n.id === event.active.id);
    if (item) setDraggedNote(item);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    isDraggingRef.current = false;
    setDraggedNote(null);

    if (!over || active.id === over.id) return;

    const oldIndex = localNotes.findIndex((n) => n.id === active.id);
    const newIndex = localNotes.findIndex((n) => n.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(localNotes, oldIndex, newIndex);

    setLocalNotes(reordered);

    isSavingOrderRef.current = true;

    try {
      await reorderNotes(
        reordered.map((note, i) => ({ id: note.id, position: i + 1 })),
      );
    } finally {
      isSavingOrderRef.current = false;
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen overflow-visible">
      <Header onTrashClick={() => setIsTrashOpen(true)} />

      <main className="container mx-auto px-4 py-8 md:py-10 overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Your Notes
            </h2>
            {totalNotes > 0 && (
              <p className="text-gray-600">
                {totalNotes} note{totalNotes !== 1 ? "s" : ""} total
              </p>
            )}
          </div>
          <button
            onClick={handleCreateNote}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
          >
            <FiPlus size={20} />
            New Note
          </button>
        </div>

        <SearchBar />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-gray-500 text-lg">
              Loading notes...
            </div>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to load notes. Please try again.
          </div>
        ) : localNotes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300 mt-8">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium">No notes found</p>
              <p className="text-sm">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first note to get started"}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={handleCreateNote}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                <FiPlus size={18} />
                Create First Note
              </button>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="columns-2 lg:columns-3 gap-4 mt-8">
              <SortableContext
                items={localNotes.map((note) => note.id)}
                strategy={rectSortingStrategy}
              >
                {localNotes.map((note, index) => (
                  <div
                    key={note.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-in break-inside-avoid-column mb-4"
                  >
                    <SortableNoteCard
                      note={note}
                      onEdit={handleEditNote}
                      onView={handleViewNote}
                    />
                  </div>
                ))}
              </SortableContext>
            </div>

            <DragOverlay zIndex={1}>
              {draggedNote ? (
                <NoteCard
                  note={draggedNote}
                  onEdit={handleEditNote}
                  onView={handleViewNote}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        <div ref={sentinelRef} className="h-4 mt-4" />

        {isFetchingNextPage && (
          <div className="flex justify-center py-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              Loading more notes...
            </div>
          </div>
        )}

        {!hasNextPage &&
          localNotes.length > 0 &&
          !isFetchingNextPage &&
          !isLoading && (
            <p className="text-center text-gray-400 text-sm py-6">
              You are caught up
            </p>
          )}
      </main>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        mode={modalMode}
        onNotesChange={() => {}}
      />

      <TrashModal isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />
    </div>
  );
}
