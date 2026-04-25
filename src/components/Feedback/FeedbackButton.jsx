// src/components/Feedback/FeedbackButton.jsx
import { FaCommentDots } from "react-icons/fa";
import { useModalManager } from "../../contexts/ModalManagerContext";
import FeedbackFormModal from "../Modal/FeedbackFormModal";

const FeedbackButton = ({ style }) => {
  const { showModal } = useModalManager();

  const openModal = () => {
    showModal(<FeedbackFormModal />);
  };

  return (
    <button
      className="flex justify-between w-full items-center bg-[#008AFF] shadow-[0_0_20px_#008AFF] backdrop-blur-md border border-gray-300 rounded-xl p-4 text-xl text-white self-start"
      onClick={openModal}
    >
      <p className="hidden sm:block">انتقادات و پیشنهادات</p>
      <FaCommentDots className="pl-1" />
    </button>
  );
};

export default FeedbackButton;