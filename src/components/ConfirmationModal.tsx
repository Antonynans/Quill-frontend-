"use client";

import Modal from "react-modal";
import { FiX, FiAlertCircle } from "react-icons/fi";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={!isLoading}
      shouldCloseOnEsc={!isLoading}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      className="bg-white rounded-xl shadow-2xl w-full max-w-sm outline-none animate-fade-in"
      style={{ overlay: { zIndex: 99 } }}
    >
      <div
        className={`bg-gradient-to-r ${
          isDangerous
            ? "from-red-500 to-red-600"
            : "from-orange-500 to-orange-600"
        } text-white p-6 rounded-t-xl flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <FiAlertCircle size={24} />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
        >
          <FiX size={24} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <p className="text-gray-600">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:cursor-not-allowed font-semibold ${
              isDangerous
                ? "bg-red-500 hover:bg-red-600 disabled:bg-red-300"
                : "bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
