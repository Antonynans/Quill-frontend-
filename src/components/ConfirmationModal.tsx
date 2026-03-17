"use client";

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
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 pointer-events-auto"
      style={{ zIndex: 999999 }}
    >
      <div
        className="bg-white z-50 rounded-xl shadow-2xl w-full max-w-sm animate-fade-in"
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${
            isDangerous
              ? "from-red-500 to-red-600"
              : "from-orange-500 to-orange-600"
          } text-white p-6 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <FiAlertCircle size={24} />
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-opacity-80 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600">{message}</p>

          {/* Buttons */}
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
      </div>
    </div>
  );
}
