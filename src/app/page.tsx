"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNotesStore } from "@/store/notesStore";
import { Header } from "@/components/Header";
import { NoteModal } from "@/components/NoteModal";
import { TrashModal } from "@/components/TrashModal";
import { SortableNoteCard } from "@/components/SortableNoteCard";
import { Note } from "@/types";
import { FiPlus, FiSearch } from "react-icons/fi";
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

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderedNotes, setOrderedNotes] = useState<Note[]>([]);
  const [draggedNote, setDraggedNote] = useState<Note | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token, fetchNotes]);

  useEffect(() => {
    if (notes) {
      setOrderedNotes(notes);
    }
  }, [notes]);

  const filteredNotes = orderedNotes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateNote = () => {
    setSelectedNote(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    fetchNotes();
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
    const draggedId = event.active.id;
    const draggedItem = orderedNotes.find((note) => note.id === draggedId);
    if (draggedItem) {
      setDraggedNote(draggedItem);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedNote(null);

    if (over && active.id !== over.id) {
      const oldIndex = filteredNotes.findIndex((note) => note.id === active.id);
      const newIndex = filteredNotes.findIndex((note) => note.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrderedNotes = arrayMove(filteredNotes, oldIndex, newIndex);
        setOrderedNotes(newOrderedNotes);

        try {
          for (let i = 0; i < newOrderedNotes.length; i++) {
            const note = newOrderedNotes[i];
            await updateNote(note.id, { position: i + 1 });
          }
          await fetchNotes();
        } catch (error) {
          console.error("Failed to update note positions:", error);
          toast.error("Failed to update note order");
          await fetchNotes();
        }
      }
    }
  };

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

        <div className="mb-6">
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse-soft text-gray-500 text-lg">
              Loading notes...
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SortableContext
                items={filteredNotes.map((note) => note.id)}
                strategy={rectSortingStrategy}
              >
                {filteredNotes.map((note, index) => (
                  <div
                    key={note.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-in"
                  >
                    <SortableNoteCard
                      note={note}
                      onEdit={handleEditNote}
                      onView={handleViewNote}
                      onNotesChange={fetchNotes}
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
                  onNotesChange={fetchNotes}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        onNotesChange={fetchNotes}
      />

      <TrashModal
        isOpen={isTrashOpen}
        onClose={() => {
          setIsTrashOpen(false);
          fetchNotes();
        }}
      />
    </div>
  );
}
