"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useNotesStore } from "@/store/notesStore";
import { Header } from "@/components/Header";
import { NoteModal } from "@/components/NoteModal";
import { TrashModal } from "@/components/TrashModal";
import { SortableNoteCard } from "@/components/SortableNoteCard";
import { SearchBar } from "@/components/Searchbar";
import { Note } from "@/types";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
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
  const { fetchNotes, notes, pagination, isLoading, updateNote } =
    useNotesStore();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [orderedNotes, setOrderedNotes] = useState<Note[]>([]);
  const [draggedNote, setDraggedNote] = useState<Note | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isFetchingMoreRef = useRef(false);
  const currentPageRef = useRef(1);
  const searchQueryRef = useRef(searchQuery);
  const paginationRef = useRef(pagination);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    isFetchingMoreRef.current = isFetchingMore;
  }, [isFetchingMore]);
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  const getHasMore = () => {
    const p = paginationRef.current;
    return p ? currentPageRef.current < p.total_pages : false;
  };

  const loadMore = useCallback(() => {
    if (isFetchingMoreRef.current || !getHasMore()) return;
    const nextPage = currentPageRef.current + 1;
    setIsFetchingMore(true);
    isFetchingMoreRef.current = true;
    setCurrentPage(nextPage);
    currentPageRef.current = nextPage;
    fetchNotes({ page: nextPage, search: searchQueryRef.current });
  }, [fetchNotes]);

  const reObserve = useCallback(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px", threshold: 0 },
    );

    observer.observe(sentinel);
    observerRef.current = observer;
  }, [loadMore]);

  useEffect(() => {
    if (!token) return;
    setOrderedNotes([]);
    setCurrentPage(1);
    currentPageRef.current = 1;
    fetchNotes({ page: 1, search: searchQuery });
  }, [token, searchQuery]);

  useEffect(() => {
    if (!notes) return;

    if (currentPageRef.current === 1) {
      setOrderedNotes(notes);
    } else {
      setOrderedNotes((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        return [...prev, ...notes.filter((n) => !existingIds.has(n.id))];
      });
    }

    setIsFetchingMore(false);
    isFetchingMoreRef.current = false;

    setTimeout(() => reObserve(), 100);
  }, [notes, reObserve]);

  useEffect(() => {
    reObserve();
    return () => observerRef.current?.disconnect();
  }, [reObserve]);

  const resetAndFetch = useCallback(() => {
    setOrderedNotes([]);
    setCurrentPage(1);
    currentPageRef.current = 1;
    fetchNotes({ page: 1, search: searchQueryRef.current });
  }, [fetchNotes]);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    resetAndFetch();
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
    const draggedItem = orderedNotes.find(
      (note) => note.id === event.active.id,
    );
    if (draggedItem) setDraggedNote(draggedItem);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedNote(null);
    if (over && active.id !== over.id) {
      const oldIndex = orderedNotes.findIndex((note) => note.id === active.id);
      const newIndex = orderedNotes.findIndex((note) => note.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(orderedNotes, oldIndex, newIndex);
        setOrderedNotes(reordered);
        try {
          for (let i = 0; i < reordered.length; i++) {
            await updateNote(reordered[i].id, { position: i + 1 });
          }
          resetAndFetch();
        } catch {
          toast.error("Failed to update note order");
          resetAndFetch();
        }
      }
    }
  };

  const hasMore = pagination ? currentPage < pagination.total_pages : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-visible">
      <Header onTrashClick={() => setIsTrashOpen(true)} />

      <main className="container mx-auto px-4 py-8 md:py-10 overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Your Notes
            </h2>
            {pagination && (
              <p className="text-gray-600">
                {pagination.total} note{pagination.total !== 1 ? "s" : ""} total
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

        {isLoading && currentPage === 1 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-gray-500 text-lg">
              Loading notes...
            </div>
          </div>
        ) : orderedNotes.length === 0 ? (
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
                items={orderedNotes.map((note) => note.id)}
                strategy={rectSortingStrategy}
              >
                {orderedNotes.map((note, index) => (
                  <div
                    key={note.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-in break-inside-avoid-column mb-4"
                  >
                    <SortableNoteCard
                      note={note}
                      onEdit={handleEditNote}
                      onView={handleViewNote}
                      onNotesChange={resetAndFetch}
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
                  onNotesChange={resetAndFetch}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        <div ref={sentinelRef} className="h-4 mt-4" />

        {isFetchingMore && (
          <div className="flex justify-center py-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              Loading more notes...
            </div>
          </div>
        )}

        {!hasMore &&
          orderedNotes.length > 0 &&
          !isFetchingMore &&
          !isLoading && (
            <p className="text-center text-gray-400 text-sm py-6">
              All {pagination?.total} notes loaded
            </p>
          )}
      </main>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        onNotesChange={resetAndFetch}
      />

      <TrashModal
        isOpen={isTrashOpen}
        onClose={() => {
          setIsTrashOpen(false);
          resetAndFetch();
        }}
      />
    </div>
  );
}
