import React, { useEffect } from "react";
import { X, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TbLoader2 } from "react-icons/tb";

interface ModalProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  height?: string; // e.g., "h-[80vh]"
  width?: string; // e.g., "max-w-2xl"
  showConfirmButton?: boolean;
  loading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  height = "h-auto",
  width = "max-w-2xl",
  showConfirmButton = true,
  loading = false,
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          // onClick={(e) => {
          //   if (e.target === e.currentTarget) {
          //     onClose();
          //   }
          // }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`bg-white w-full ${width} ${height} rounded-lg shadow-lg overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {title || "Modal Başlık"}
              </h2>
              <div className="flex items-center gap-2">
                {!loading && showConfirmButton && onConfirm && (
                  <button
                    onClick={onConfirm}
                    title="Onayla"
                    className="p-2 rounded-full bg-slate-100 hover:bg-green-100 text-green-600"
                  >
                    <Check size={21} />
                  </button>
                )}
                {loading && (
                  <TbLoader2 className="size-5 animate-spin text-primary" />
                )}

                <button
                  onClick={onClose}
                  title="Kapat"
                  className="p-2 rounded-full bg-slate-100 hover:bg-red-100 text-red-600"
                >
                  <X size={21} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
