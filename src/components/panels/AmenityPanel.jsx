// components/panels/AmenityPanel.jsx
import { useRef, useState, useEffect } from 'react';
import PanelModal from '../Modal/PanelModal';
import { usePath } from '../../contexts/PathContext';

export default function AmenityPanel({ amenity = [], maxVisible = 20 }) {
  const [modalOpen, setModalOpen] = useState(false);
  const visible = amenity.slice(0, maxVisible);
  const hidden = amenity.slice(maxVisible);

  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { fetchPath } = usePath();

  // افزودن/حذف کلاس scrolling برای ظاهر شدن نرم نوار
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      el.classList.add('scrolling');
      clearTimeout(el._scrollTimeout);
      el._scrollTimeout = setTimeout(() => {
        el.classList.remove('scrolling');
      }, 500);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // هندل موس درگ
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden transition-all duration-300 cursor-grab active:cursor-grabbing px-4"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={(e) => {
          containerRef.current.scrollLeft += e.deltaY;
        }}
      >
        {visible.map((amenity, i) => (
          <div
            key={i}
            className="flex items-center gap-1 px-3 py-1 bg-neutral-700 rounded-full text-sm whitespace-nowrap border border-gray-500 hover:bg-neutral-600 transition"
            onClick={() => {
              // استفاده از fetchPath داخل Context
              const start = { x: 58, y: 185, z: 1 }; // جایگزین کن با موقعیت فعلی واقعی کاربر
              const end = {
                x: amenity.entrance.x,
                y: amenity.entrance.y,
                z: 1, // در صورت نیاز به تغییر طبقه
              };
              fetchPath(start, end); // از context گرفته شده
            }}
          >
            <span className="text-3xl">{amenity.icon}</span>
            <span className="text-xl">{amenity.name}</span>
          </div>
        ))}
        {hidden.length > 0 && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1 bg-neutral-600 rounded-full text-sm"
          >
            بیشتر...
          </button>
        )}
      </div>

      {modalOpen && (
        <PanelModal
          categories={hidden}
          onClose={() => setModalOpen(false)}
          title="سایر ابزارها"
        />
      )}
    </div>
  );
}
