import { useModal } from "../../context/ModalContext";
import { X } from "lucide-react";

export default function ModalRoot() {
  const { isOpen, content, closeModal, options } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300
">
      <div
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl max-w-lg w-full p-6 relative transform transition-all duration-300"
      >
        {/* Botón de cerrar */}
        {!options.hideClose && (
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}

        {content}
      </div>
    </div>
  );
}
