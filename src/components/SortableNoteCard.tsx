"use client";

import { Note } from "@/types";
import { NoteCard } from "@/components/NoteCard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

interface SortableNoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onView: (note: Note) => void;
  onNotesChange?: () => void;
}

export function SortableNoteCard({
  note,
  onEdit,
  onView,
  onNotesChange,
}: SortableNoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-12 p-1.5 hover:bg-gray-200 rounded-lg cursor-grab active:cursor-grabbing z-20 transition-colors"
        title="Drag to reorder"
      >
        <MdDragIndicator size={18} className="text-gray-500" />
      </div>

      <NoteCard
        note={note}
        onEdit={onEdit}
        onView={onView}
        onNotesChange={onNotesChange}
      />
    </div>
  );
}
