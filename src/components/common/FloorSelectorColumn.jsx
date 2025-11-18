import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaBuilding, FaTimes } from "react-icons/fa";
import { useFloors } from "../../hooks/useFloors";
import { useIsDesktop } from "../../hooks/useIsDesktop";

export default function FloorSelectorColumn({ floors = [], onSelect, activeFloor }) {
  // ❗ همه Hookها در بالا و بدون شرط
  const isDesktop = useIsDesktop();           // Hook #1
  const [showFloors, setShowFloors] = useState(isDesktop); // Hook #2
  const { floors: savedFloors, loading } = useFloors();     // Hook #3

  // sync showFloors با سایز
  useEffect(() => {                            // Hook #4
    setShowFloors(isDesktop);
  }, [isDesktop]);

  // بعد از همه‌ی Hookها تازه تصمیم می‌گیریم چی رندر کنیم
  const displayFloors = (floors?.length ?? 0) > 0 ? floors : (savedFloors ?? []);
  const hasFloors = !loading && displayFloors.length > 0;

  // مرتب‌سازی (بدون useMemo تا Hook اضافه نشه)
  const sortedFloors = hasFloors
    ? [...displayFloors].sort((a, b) => (b?.number ?? 0) - (a?.number ?? 0))
    : [];

  const currentIndex = hasFloors
    ? sortedFloors.findIndex((f) => f?.number === activeFloor?.number)
    : -1;

  const goToNextFloor = () => {
    if (currentIndex > 0) onSelect?.(sortedFloors[currentIndex - 1]);
  };
  const goToPrevFloor = () => {
    if (currentIndex !== -1 && currentIndex < sortedFloors.length - 1) {
      onSelect?.(sortedFloors[currentIndex + 1]);
    }
  };

  const upDisabled = currentIndex <= 0;
  const downDisabled = currentIndex === -1 || currentIndex >= sortedFloors.length - 1;

  // اگه داده نداری، فقط FAB موبایل رو نشون نده؛ کل کامپوننت خالی
  if (!hasFloors) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md border border-gray-300 rounded-4xl shadow-md p-4 flex flex-col items-center z-40">

      {/* پنل لیست با انیمیشن اکاردئونی ساده */}
      <div
        className={`flex flex-col items-center w-full overflow-hidden transition-all duration-300 ease-out
        ${showFloors ? "opacity-100 translate-y-0 max-h-[60vh]" : "opacity-0 -translate-y-1 max-h-0 pointer-events-none"}
        `}
      >
        <button
          aria-label="طبقه بالاتر"
          onClick={goToNextFloor}
          disabled={upDisabled}
          className={`mb-2 transition-transform duration-200
            ${upDisabled ? "opacity-40 cursor-not-allowed" : "hover:scale-110"}`}
        >
          <FaArrowUp className="text-gray-300 hover:text-white" />
        </button>

        <div className="px-1 flex flex-col w-full max-h-[50vh] overflow-y-auto">
          {sortedFloors.map((floor, index) => {
            const isActive =
              activeFloor?.number === floor?.number || activeFloor?.name === floor?.name;
            return (
              <button
                key={index}
                onClick={() => onSelect?.(floor)}
                style={{ transitionDelay: `${index * 35}ms` }}
                className={`font-semibold my-1 transition-all duration-200 ease-out
                  ${showFloors ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
                  ${isActive ? "text-yellow-300 text-xl scale-110" : "text-white hover:text-blue-600"}`}
              >
                {typeof floor === "object" ? floor.name : floor}
              </button>
            );
          })}
        </div>

        <button
          aria-label="طبقه پایین‌تر"
          onClick={goToPrevFloor}
          disabled={downDisabled}
          className={`mt-2 transition-transform duration-200
            ${downDisabled ? "opacity-40 cursor-not-allowed" : "hover:scale-110"}`}
        >
          <FaArrowDown className="text-gray-300 hover:text-white" />
        </button>
      </div>

      {/* دکمه موبایل با چرخش آیکن */}
      <button
        className="sm:hidden py-2 transition-transform duration-300 active:scale-95"
        onClick={() => setShowFloors((v) => !v)}
        aria-label={showFloors ? "بستن لیست طبقات" : "باز کردن لیست طبقات"}
        title={showFloors ? "بستن" : "باز کردن"}
      >
        <span className={`transition-transform duration-300 ${showFloors ? "rotate-180" : "rotate-0"}`}>
          {showFloors ? <FaTimes className="text-gray-200 mt-2" /> : <FaBuilding className="text-gray-200" />}
        </span>
      </button>
    </div>
  );
}
