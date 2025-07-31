import React, { useEffect, useState } from 'react';

export default function PanelModal({ isOpen, onClose, title, children }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // کمی تأخیر برای شروع انیمیشن
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      // زمان کافی برای اتمام انیمیشن خروج
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className=" flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={` transition-opacity duration-300 ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-black/40 backdrop-blur-md border border-gray-500 text-white px-10 py-4 mb-3 space-y-6 rounded-2xl w-full transition-transform duration-300 ease-out ${
          animateIn ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* عنوان و دکمه بستن */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-red-400 hover:text-red-600 text-lg font-bold">
            ✕
          </button>
        </div>

        {/* محتوای نتایج */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ease-out ${
                animateIn 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-full opacity-0'
              }`}
              style={{
                transitionDelay: animateIn ? `${index * 100}ms` : '0ms'
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}