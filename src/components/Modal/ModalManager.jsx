import { useModalManager } from "../../contexts/ModalManagerContext";

export default function ModalManager() {
  const { isOpen, hideModal, content } = useModalManager();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className=" p-6 rounded-xl shadow-xl text-black">
        <button onClick={hideModal} className="mb-2 text-blue-600 bg-gray-700 rounded-md p-1">
          بستن
        </button>
        {content}

      </div>
    </div>
  );
}
