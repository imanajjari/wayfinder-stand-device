// components/panels/SearchPanel.jsx
import { MdSearch } from 'react-icons/md';
import useLanguage from '../../hooks/useLanguage';
import ThemeToggle from '../buttons/ThemeToggle';
import PathTestButton from '../buttons/PathTestButton';
import LocationButton from '../buttons/LocationButton';

export default function SearchPanel() {
  const { changeLanguage, language } = useLanguage();

  const buttons = [
    { code: 'fa', label: 'فارسی' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  return (
    <div className=" md:flex justify-between flex-col md:flex-row gap-4 px-10 ">
        {/* جستجو */}
  <div className="flex items-center gap-2 w-full md:w-1/2">
    <input
      type="text"
      placeholder="عبارتی برای جست‌وجو وارد کنید..."
      className="flex-1 px-4 py-2 rounded-xl text-black bg-white text-base md:text-2xl"
    />
    <button className="bg-blue-600 text-2xl md:text-3xl text-white p-2 rounded-xl hover:bg-blue-500 transition">
      <MdSearch />
    </button>
  </div>

  {/* دکمه‌های زبان */}
  <div className="flex justify-center gap-2 pt-2 md:p-0">
    {buttons.map(({ code, label }) => (
      <button
        key={code}
        onClick={() => changeLanguage(code)}
        className={`px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-500 transition text-sm ${
          language === code
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        {label}
      </button>
    ))}
    <LocationButton />
      {/* دکمه تم */}
      {/* <ThemeToggle /> */}
      {/* <PathTestButton /> */}
  </div>





</div>

  );
}
