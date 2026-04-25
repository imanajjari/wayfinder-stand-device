// src/components/Modal/MenuModal.jsx
import React from 'react';
import { useModalManager } from '../../contexts/ModalManagerContext';



import ScreenshotQrOverlay from '../scene/ScreenshotQrOverlay';
import CustomerClubButton from '../buttons/CustomerClubButton';
import FeedbackButton from '../Feedback/FeedbackButton';
import FAQButton from '../FAQ/FAQButton';

const MenuModal = () => {
  const { hideModal } = useModalManager();

  return (
    <div
      className="
        bg-black/60 backdrop-blur-sm 
        border border-white/20 
        rounded-2xl 
        px-6 py-8 
        flex flex-col 
        items-center 
        gap-4 
        text-white 
        w-[300px]
      "
      dir="rtl"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold text-center mb-2">منو</h2>
      
      {/* دکمه‌های داخل مودال */}
      <div className="flex flex-col gap-3 w-full">
        {/* <ScreenshotQrOverlay /> */}
        <CustomerClubButton />
        <FeedbackButton />
        <FAQButton />
      </div>

      {/* دکمه بستن */}
      <button
        onClick={hideModal}
        className="
          mt-4 
          w-full 
          py-2 
          rounded-lg 
          bg-gray-600 
          hover:bg-gray-700 
          transition 
          text-white
        "
      >
        بستن
      </button>
    </div>
  );
};

export default MenuModal;