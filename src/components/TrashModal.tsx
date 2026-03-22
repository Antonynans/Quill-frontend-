"use client";

import { useState } from "react";
import Modal from "react-modal";
import {
  useTrash,
  usePermanentDeleteNote,
  useRestoreNote,
} from "@/hooks/useNotes";
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
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { data, isLoading } = useTrash();
  const { mutateAsync: permanentDelete, isPending: isDeleting } =
    usePermanentDeleteNote();
  const { mutateAsync: restoreNote, isPending: isRestoring } = useRestoreNote();

  const trash = data?.items ?? [];
  const isBusy = isDeleting || isRestoring;

  const handleRestoreConfirm = async () => {
    if (!selectedNote) return;
    try {
      await restoreNote(selectedNote.id);
      toast.success("Note restored");
      setShowRestoreConfirm(false);
      setSelectedNote(null);
    } catch {
      toast.error("Failed to restore note");
    }
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!selectedNote) return;
    try {
      await permanentDelete(selectedNote.id);
      toast.success("Note permanently deleted");
      setShowDeleteConfirm(false);
      setSelectedNote(null);
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick
        shouldCloseOnEsc
        ariaHideApp={false}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto outline-none animate-fade-in"
        style={{ overlay: { zIndex: 99 } }}
      >
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Trash</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-400 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

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
                      {note.updated_at &&
                        formatDistanceToNow(new Date(note.updated_at), {
                          addSuffix: true,
                        })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedNote(note);
                        setShowRestoreConfirm(true);
                      }}
                      disabled={isBusy}
                      className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Restore"
                    >
                      <FiRotateCcw size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNote(note);
                        setShowDeleteConfirm(true);
                      }}
                      disabled={isBusy}
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

        <div className="border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={showRestoreConfirm}
        onClose={() => {
          setShowRestoreConfirm(false);
          setSelectedNote(null);
        }}
        onConfirm={handleRestoreConfirm}
        isLoading={isRestoring}
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
        title="Permanently Delete"
        message="This will permanently delete the note. This action cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </>
  );
}
