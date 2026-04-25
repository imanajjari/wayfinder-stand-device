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
      className="flex justify-between w-full items-center bg-[#008AFF] shadow-[0_0_20px_#008AFF] backdrop-blur-md border border-gray-300 rounded-xl p-4 text-xl text-white self-start"
    >
        <p>
            سوالات متداول
        </p>
      <HiOutlineQuestionMarkCircle />
    </button>
  );
}