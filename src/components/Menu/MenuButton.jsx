// src/components/Menu/MenuButton.jsx
import React from 'react';
import { HiOutlineMenu } from "react-icons/hi";
import { useModalManager } from "../../contexts/ModalManagerContext";
import MenuModal from '../Modal/MenuModal';


export default function MenuButton() {
  const { showModal } = useModalManager();

  const openModal = () => {
    showModal(<MenuModal />);
  };

  return (
    <button
      onClick={openModal}
      className="text-xl sm:text-2xl p-2 md:px-4 md:py-2 rounded-xl border border-gray-500 transition bg-[#324154] text-white"
    >
      <HiOutlineMenu />
    </button>
  );
}