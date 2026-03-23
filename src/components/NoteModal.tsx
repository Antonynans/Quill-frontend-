"use client";

import { Note, CreateNotePayload, UpdateNotePayload } from "@/types";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { useState, useEffect, useCallback } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const ALLOWED_COLOURS = [
  "#ffffff",
  "#fef9c3",
  "#fefce8",
  "#dcfce7",
  "#dbeafe",
  "#fce7f3",
  "#ffedd5",
  "#fde68a",
  "#a7f3d0",
  "#bfdbfe",
  "#fbcfe8",
  "#c4b5fd",
  "#fed7aa",
  "#fca5a5",
];
const DEFAULT_COLOUR = "#ffffff";

const getNowLocal = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
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
  const [colour, setColour] = useState(DEFAULT_COLOUR);
  const [reminderAt, setReminderAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { mutateAsync: createNote, isPending: isCreating } = useCreateNote();
  const { mutateAsync: updateNote } = useUpdateNote();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description ?? "");
      setSelectedTags(note.tags || []);
      const noteColour = note.colour ?? DEFAULT_COLOUR;
      setColour(
        ALLOWED_COLOURS.includes(noteColour) ? noteColour : DEFAULT_COLOUR,
      );
      setReminderAt(note.reminder_at || "");
    } else {
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setColour(DEFAULT_COLOUR);
      setReminderAt("");
    }
  }, [note, isOpen]);

  const getChangedFields = useCallback((): UpdateNotePayload | null => {
    if (!note) return null;

    const payload: UpdateNotePayload = {};

    if (title !== note.title) payload.title = title;

    if (description !== (note.description ?? ""))
      payload.description = description;

    if (JSON.stringify(selectedTags) !== JSON.stringify(note.tags || []))
      payload.tags = selectedTags.length > 0 ? selectedTags : [];

    const originalColour = ALLOWED_COLOURS.includes(note.colour ?? "")
      ? note.colour
      : DEFAULT_COLOUR;
    if (colour !== originalColour) payload.colour = colour;

    if (reminderAt !== (note.reminder_at || ""))
      payload.reminder_at = reminderAt || undefined;

    return Object.keys(payload).length > 0 ? payload : null;
  }, [note, title, description, selectedTags, colour, reminderAt]);

  const handleClose = useCallback(async () => {
    if (mode === "edit" && note) {
      const payload = getChangedFields();
      if (payload && title.trim()) {
        setIsSaving(true);
        try {
          await updateNote({ id: note.id, payload });
        } catch {
          toast.error("Failed to save note");
        } finally {
          setIsSaving(false);
        }
      }
    }
    onClose();
  }, [mode, note, title, getChangedFields, updateNote, onClose]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const payload: CreateNotePayload = {
        title,
        description,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        colour: colour !== DEFAULT_COLOUR ? colour : undefined,
        reminder_at: reminderAt || undefined,
      };
      await createNote(payload);
      toast.success("Note created");
      onClose();
    } catch {
      toast.error("Failed to create note. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleClose}
      style={{ zIndex: 99 }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "New Note" : "Edit Note"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="p-2 hover:bg-orange-400 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiX size={24} />
            )}
          </button>
        </div>

        <form
          onSubmit={
            mode === "create" ? handleCreate : (e) => e.preventDefault()
          }
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTags(
                        selectedTags.filter((_, i) => i !== index),
                      )
                    }
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex gap-3 overflow-auto">
              {ALLOWED_COLOURS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColour(hex)}
                  title={hex}
                  style={{ backgroundColor: hex }}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex-shrink-0 flex items-center justify-center ${
                    colour === hex
                      ? "scale-110 shadow-md"
                      : " hover:scale-110 hover:border-gray-200"
                  }`}
                >
                  {colour === hex && (
                    <span className="text-gray-600 text-xs font-bold leading-none">
                      ✓
                    </span>
                  )}
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

          {mode === "create" && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
