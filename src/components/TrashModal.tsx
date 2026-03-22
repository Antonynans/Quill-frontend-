"use client";

import { useEffect, useState } from "react";
import { useNotesStore } from "@/store/notesStore";
import { FiX, FiTrash2, FiRotateCcw } from "react-icons/fi";
import { Note } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { toast } from "react-toastify";

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrashModal({ isOpen, onClose }: TrashModalProps) {
  const { trash, isLoading, fetchTrash, permanentDeleteNote, restoreNote } =
    useNotesStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTrash();
    }
  }, [isOpen, fetchTrash]);

  const handleRestoreClick = (note: Note) => {
    setSelectedNote(note);
    setShowRestoreConfirm(true);
  };

  const handleRestoreConfirm = async () => {
    if (!selectedNote) return;
    try {
      setIsDeleting(true);
      await restoreNote(selectedNote.id);
      toast.success("Note restored successfully");
      setShowRestoreConfirm(false);
      setSelectedNote(null);
    } catch (error) {
      console.error("Failed to restore note:", error);
      toast.error("Failed to restore note");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDeleteClick = (note: Note) => {
    setSelectedNote(note);
    setShowDeleteConfirm(true);
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!selectedNote) return;
    try {
      setIsDeleting(true);
      await permanentDeleteNote(selectedNote.id);
      toast.success("Note permanently deleted");
      setShowDeleteConfirm(false);
      setSelectedNote(null);
    } catch (error) {
      console.error("Failed to permanently delete note:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{ zIndex: 999999 }}
      >
        <ConfirmationModal
          isOpen={showRestoreConfirm}
          onClose={() => {
            setShowRestoreConfirm(false);
            setSelectedNote(null);
          }}
          onConfirm={handleRestoreConfirm}
          isLoading={isDeleting}
          title="Restore Note"
          message="Are you sure you want to restore this note?"
          confirmText="Restore"
        />
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedNote(null);
          }}
          onConfirm={handlePermanentDeleteConfirm}
          isLoading={isDeleting}
          title="Permanently Delete Note"
          message="This will permanently delete the note. This action cannot be undone."
          confirmText="Delete"
          isDangerous
        />
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Trash</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-400 rounded-lg transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading trash...</div>
              </div>
            ) : trash.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Your trash is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trash.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Deleted{" "}
                        {note.updated_at && formatDistanceToNow(new Date(note.updated_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestoreClick(note)}
                        disabled={isDeleting}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors disabled:opacity-50"
                        title="Restore"
                      >
                        <FiRotateCcw size={18} />
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteClick(note)}
                        disabled={isDeleting}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                        title="Permanently delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
