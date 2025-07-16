// components/panels/CategoriesPanel.jsx
import { useEffect, useRef, useState } from 'react';
import PanelModal from '../Modal/PanelModal';
import { usePath } from '../../contexts/PathContext';
import { getFileUrl } from '../../services/fileService';
import { searchDestinationsByCategory } from '../../services/destinationService';

export default function CategoriesPanel({ categories = [], maxVisible = 20, onShowResult ,setIsResultOpen }) {
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { fetchPath } = usePath();

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
    const walk = (x - startX) * 1.5; // سرعت حرکت
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
        results.map((shop, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-neutral-800 p-4 rounded-xl border border-gray-600"
            onClick={() => {
              // const start = { x: 58, y: 185, z: 1 };
              const end = {
                x: shop.entrance.x,
                y: shop.entrance.y,
                z: 1,
              };
              fetchPath(null, end);
              setIsResultOpen(false)// این خط اضافه شود
            }}
          >
            {shop.icon ?
              <img
              src={getFileUrl(shop.icon)}
              alt={shop.name}
              className="w-20 h-20 rounded-xl bg-neutral-600 flex items-center justify-center text-white text-lg font-bold"
            />
            :
            <div className="w-20 h-20 rounded-xl bg-neutral-600 flex items-center justify-center text-white text-lg font-bold">
              {shop.shortName[0]}
            </div>
            }
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{shop.fullName}</h3>
              <p className="text-sm text-gray-300">{shop.description}</p>
              <p className="text-sm text-gray-400">
                طبقه {shop.floorNumber} - ساختمان {shop.buildingNumber}
              </p>
            </div>
          </div>
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

      {/* مدال برای نمایش دسته‌بندی‌های اضافی */}
      <PanelModal 
  isOpen={modalOpen} 
  onClose={() => setModalOpen(false)} 
  title="سایر دسته‌بندی‌ها"
>
  {hidden.map((cat, index) => (
    <div
      key={index}
      className="flex items-center gap-3 p-3 bg-neutral-800 rounded-xl border border-gray-600 hover:bg-neutral-700 transition cursor-pointer"
      onClick={async () => {
        try {
          const results = await searchDestinationsByCategory(cat.name);
          onShowResult(
            results.map((shop, shopIndex) => (
              <div
                key={shopIndex}
                className="flex items-start gap-4 bg-neutral-800 p-4 rounded-xl border border-gray-600"
                onClick={() => fetchPath('A1', shop.uniqueId)}
              >
                <div className="w-20 h-20 rounded-xl bg-neutral-600 flex items-center justify-center text-white text-lg font-bold">
                  {shop.shortName[0]}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{shop.fullName}</h3>
                  <p className="text-sm text-gray-300">{shop.description}</p>
                  <p className="text-sm text-gray-400">
                    طبقه {shop.floorNumber} - ساختمان {shop.buildingNumber}
                  </p>
                </div>
              </div>
            ))
          );
          setModalOpen(false);
        } catch (err) {
          console.error(`❌ خطا در دریافت فروشگاه‌های دسته ${cat.name}:`, err);
        }
      }}
    >
      <img
        src={getFileUrl(cat.icon)}
        alt={cat.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <span className="text-lg">{cat.name}</span>
    </div>
  ))}
</PanelModal>

    </div>
  );
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex text-yellow-400 text-sm">
      {'★'.repeat(fullStars)}
      {halfStar && '½'}
      {'☆'.repeat(emptyStars)}
    </div>
  );
}
