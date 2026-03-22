"use client";

import { Note } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useDeleteNote, useTogglePin } from "@/hooks/useNotes";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { toast } from "react-toastify";

const getColourClass = (col: string) => {
  const colourMap: Record<string, string> = {
    red: "bg-red-100 text-red-900 border border-red-300",
    orange: "bg-orange-100 text-orange-900 border border-orange-300",
    yellow: "bg-yellow-100 text-yellow-900 border border-yellow-300",
    green: "bg-green-100 text-green-900 border border-green-300",
    blue: "bg-blue-100 text-blue-900 border border-blue-300",
    pink: "bg-pink-100 text-pink-900 border border-pink-300",
    cyan: "bg-cyan-100 text-cyan-900 border border-cyan-300",
    slate: "bg-slate-100 text-slate-900 border border-slate-300",
  };
  return colourMap[col] || "bg-gray-100 text-gray-900 border border-gray-300";
};

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onView: (note: Note) => void;
  onNotesChange?: () => void;
}

export function NoteCard({ note, onEdit, onView }: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();
  const { mutate: togglePin, isPending: isPinning } = useTogglePin();
  const isLoading = isDeleting || isPinning;

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleDeleteConfirm = () => {
    deleteNote(note.id, {
      onSuccess: () => {
        toast.success("Note deleted");
        setShowDeleteConfirm(false);
      },
      onError: () => toast.error("Failed to delete note"),
    });
  };

  const handleTogglePin = () => {
    togglePin(note.id, {
      onSuccess: () => {
        toast.success(note.is_pinned ? "Note unpinned" : "Note pinned");
        setShowMenu(false);
      },
      onError: () => toast.error("Failed to toggle pin"),
    });
  };

  return (
    <>
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Note"
        message="Are you sure you want to delete this note? It will be moved to trash."
        confirmText="Delete"
        isDangerous
      />

      <div
        className={`rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 relative group animate-fade-in ${getColourClass(note.colour)}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              {note.status}
            </span>
            {note.is_pinned && (
              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                📌 Pinned
              </span>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <FiMoreVertical size={16} className="text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-40 animate-fade-in">
                <button
                  onClick={() => { onEdit(note); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <FiEdit2 size={16} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={handleTogglePin}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span className="text-base">{note.is_pinned ? "📌" : "📍"}</span>
                  <span>{note.is_pinned ? "Unpin" : "Pin"}</span>
                </button>

                <button
                  onClick={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors border-t border-gray-200 disabled:opacity-50"
                >
                  <FiTrash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div onClick={() => onView(note)} className="cursor-pointer">
          <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">
            {note.title || "Untitled Note"}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {note.description || "No content"}
          </p>
        </div>

        <div className="flex lg:items-center lg:flex-row flex-col justify-between text-xs text-gray-500 border-t pt-3 gap-4">
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 lg:w-full">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md line-clamp-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="lg:flex justify-end w-full">
            <span>
              {note.edited_at
                ? `Edited ${formatDistanceToNow(new Date(note.edited_at), { addSuffix: true })}`
                : `Created ${formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
