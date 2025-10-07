import { useState, useEffect, useRef } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import useLanguage from '../../hooks/useLanguage';
import { MdGTranslate } from "react-icons/md";

export default function LanguageDropdown() {
  const { changeLanguage, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const buttons = [
    { code: 'fa', label: 'فارسی' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];

  const currentLang = buttons.find(b => b.code === language)?.label || 'Language';

  // بستن منو با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* دکمه اصلی */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 px-2 sm:px-4 py-2 bg-gray-700 text-white rounded-xl border border-gray-500 hover:bg-gray-600 transition"
      >
        <span className='hidden sm:block'>{currentLang}</span>
        <span className='block sm:hidden text-xl'><MdGTranslate /></span>
        <MdKeyboardArrowDown
          className={`hidden sm:block w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* منوی بازشونده به بالا */}
      {open && (
        <div className="absolute bottom-full mb-2 w-36 bg-gray-800 text-white rounded-xl shadow-lg border border-gray-600 z-50">
          {buttons.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => {
                changeLanguage(code);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded-xl transition ${
                language === code
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
