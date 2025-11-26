import { useModalManager } from "../../contexts/ModalManagerContext";
import { IoMdClose } from "react-icons/io";
import { useRef } from "react";

export default function ModalManager() {
  const { isOpen, hideModal, content } = useModalManager();
  const modalRef = useRef(null);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // اگر روی بک‌دراپ کلیک شد → ببند
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      hideModal();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onMouseDown={handleOverlayClick} // مهم: روی overlay هندل شود
    >
      <div
        ref={modalRef}
      >
        <button
          onClick={hideModal}
          className="mb-2 text-xl text-red-600 bg-gray-700 rounded-md p-1"
        >
          <IoMdClose />
        </button>

        {content}
      </div>
    </div>
  );
}
