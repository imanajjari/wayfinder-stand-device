import { useEffect, useRef, useState } from 'react';
import { usePath } from '../../contexts/PathContext';
import { getFileUrl } from '../../services/fileService';
import { searchDestinationsByCategory } from '../../services/destinationService';
import { findFloorOfDestination } from '../../lib/floorUtils';
import DestinationListModal from '../Modal/DestinationListModal';
import DestinationCard from '../cards/DestinationCard';
import { getMyStand } from '../../services/floorService';

export default function CategoriesPanel({ categories = [], maxVisible = 20, onShowResult, setIsResultOpen }) {
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { fetchPath, updateDestination } = usePath();
const myStand = getMyStand();
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

  const visible = categories.slice(0, maxVisible);
  const hidden = categories.slice(maxVisible);

  const handleCategoryClick = async (cat) => {
    try {
      const results = await searchDestinationsByCategory(cat.name);
      onShowResult(
        results.data.map((shop, index) => (
          <DestinationCard
            key={index}
            shop={shop}
            myStand = {myStand}
            onClick={() => {
              updateDestination({
                x: shop.entrance.x,
                y: shop.entrance.y,
                z: 1,
                floorNumber: shop.floorNum,
                floorId: findFloorOfDestination(shop).floorId,
              });
              setIsResultOpen(false);
            }}
          />
        ))
      );
    } catch (err) {
      console.error(`❌ خطا در دریافت فروشگاه‌های دسته ${cat.name}:`, err);
    }
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
        {visible.map((cat, i) => (
          <button
            key={i}
            onClick={() => handleCategoryClick(cat)}
            className="flex items-center gap-2 px-3 py-1 bg-neutral-700 rounded-full whitespace-normal break-words border border-gray-500 hover:bg-neutral-600 transition"
          >
            <img
              src={getFileUrl(cat.icon)}
              alt={cat.name}
              className="w-5 md:w-8 rounded-full object-cover"
            />
            <p className="text-base lg:text-lg">{cat.name}</p>
          </button>
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

      <DestinationListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="سایر دسته‌بندی‌ها"
        destinations={hidden}
        onSelect={async (cat) => {
          try {
            const results = await searchDestinationsByCategory(cat.name);
            onShowResult(
              results.data.map((shop, i) => (
                <DestinationCard
                  key={i}
                  shop={shop}
                  myStand = {myStand}
                  onClick={() => {
                    fetchPath('A1', shop.uniqueId);
                    setModalOpen(false);
                  }}
                />
              ))
            );
          } catch (err) {
            console.error(`❌ خطا در دریافت فروشگاه‌های دسته ${cat.name}:`, err);
          }
        }}
      />
    </div>
  );
}
