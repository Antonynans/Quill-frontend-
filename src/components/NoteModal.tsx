"use client";

import { Note, CreateNotePayload, UpdateNotePayload } from "@/types";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

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

const getNowLocal = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  onNotesChange?: () => void;
}

export function NoteModal({ note, isOpen, onClose, mode }: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [colour, setColour] = useState("white");
  const [reminderAt, setReminderAt] = useState("");

  const { mutateAsync: createNote, isPending: isCreating } = useCreateNote();
  const { mutateAsync: updateNote, isPending: isUpdating } = useUpdateNote();
  const isLoading = isCreating || isUpdating;

  const hasChanges =
    note &&
    (title !== note.title ||
      description !== note.description ||
      JSON.stringify(selectedTags) !== JSON.stringify(note.tags || []) ||
      colour !== (note.colour || "white") ||
      reminderAt !== (note.reminder_at || ""));

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description ?? "");
      setSelectedTags(note.tags || []);
      setColour(note.colour || "white");
      setReminderAt(note.reminder_at || "");
    } else {
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setColour("white");
      setReminderAt("");
    }
  }, [note, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        const payload: CreateNotePayload = {
          title,
          description,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          colour: colour !== "white" ? colour : undefined,
          reminder_at: reminderAt || undefined,
        };
        await createNote(payload);
        toast.success("Note created");
      } else if (mode === "edit" && note) {
        const payload: UpdateNotePayload = {
          title,
          description,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          colour: colour !== "white" ? colour : undefined,
          reminder_at: reminderAt || undefined,
        };
        await updateNote({ id: note.id, payload });
        toast.success("Note updated");
      }
      onClose();
    } catch {
      toast.error("Failed to save note. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ zIndex: 999999 }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {mode === "create" && "New Note"}
            {mode === "edit" && (hasChanges ? "Edit Note" : "View Note")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-400 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setSelectedTags(selectedTags.filter((_, i) => i !== index))}
                    className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a tag and press Enter..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const newTag = e.currentTarget.value.trim();
                  if (newTag && !selectedTags.includes(newTag)) {
                    setSelectedTags([...selectedTags, newTag]);
                    e.currentTarget.value = "";
                  }
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Colour</label>
            <div className="grid grid-cols-6 gap-3">
              {["red", "orange", "yellow", "green", "blue", "pink", "cyan", "slate"].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColour(col)}
                  className={`h-12 rounded-lg font-semibold text-sm transition-all ${
                    colour === col
                      ? "ring-2 ring-offset-2 ring-gray-400 scale-105"
                      : "hover:scale-105"
                  } ${getColourClass(col)}`}
                  title={col}
                >
                  {colour === col && "✓"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reminder (Optional)
            </label>
            {reminderAt && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Set for:</span>{" "}
                  {new Date(reminderAt).toLocaleString()}
                </p>
              </div>
            )}
            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              min={getNowLocal()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
            />
            {reminderAt && (
              <button
                type="button"
                onClick={() => setReminderAt("")}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove reminder
              </button>
            )}
          </div>

          <div className="flex items-center justify-end text-xs text-gray-500 border-t pt-3">
            <span>
              {note?.edited_at
                ? `Edited ${formatDistanceToNow(new Date(note.edited_at), { addSuffix: true })}`
                : note?.created_at
                  ? `Created ${formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}`
                  : ""}
            </span>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            {(mode === "create" || hasChanges) && (
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
