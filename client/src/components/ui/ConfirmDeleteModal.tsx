import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  message = "Bu satırı silmek istediğinize emin misiniz?",
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center"
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="text-red-500 hover:bg-red-100 p-1.5 rounded-full"
                title="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
              <Trash2 size={36} className="text-red-500" />
              <p className="text-gray-700 text-sm font-medium leading-relaxed">
                {message}
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Vazgeç
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-md text-sm bg-red-600 hover:bg-red-700 text-white"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
