import React, { useEffect, useRef } from 'react';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';

export default function LocationButton() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const hasActiveCustomer = useRef(false);

  const refreshPage = () => {
    navigate(0);
    hasActiveCustomer.current = false; // وقتی رفرش شد یعنی مشتری رفت
  };

  const startInactivityTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (hasActiveCustomer.current) {
        refreshPage();
      }
    }, 6000 * 1000); // 1 دقیقه بی‌حرکتی
  };

  const onUserInteraction = () => {
    if (!hasActiveCustomer.current) {
      // console.log('مشتری جدید شروع به تعامل کرد');
    }
    hasActiveCustomer.current = true; // مشتری فعال است
    startInactivityTimer();
  };

  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown'];

    events.forEach(event =>
      window.addEventListener(event, onUserInteraction)
    );

    return () => {
      events.forEach(event =>
        window.removeEventListener(event, onUserInteraction)
      );
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      onClick={refreshPage}
      className="text-xl sm:text-2xl p-2 md:px-4 md:py-2 rounded-xl border border-gray-500 transition bg-[#324154] text-white"
    >
      <HiOutlineLocationMarker  />
    </button>
  );
}
