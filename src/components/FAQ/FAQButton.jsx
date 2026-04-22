// src/components/FAQ/FAQButton.jsx
import React from 'react';
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { useModalManager } from "../../contexts/ModalManagerContext";
import FAQModal from "../Modal/FAQModal";

export default function FAQButton() {
  const { showModal } = useModalManager();

  const openModal = () => {
    showModal(<FAQModal />);
  };

  return (
    <button
      onClick={openModal}
      className="text-xl sm:text-2xl p-2 md:px-4 md:py-2 rounded-xl border border-gray-500 transition bg-[#324154] text-white"
    >
      <HiOutlineQuestionMarkCircle />
    </button>
  );
}