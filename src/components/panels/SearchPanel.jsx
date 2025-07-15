import { MdSearch } from 'react-icons/md';
import { useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import LocationButton from '../buttons/LocationButton';
import { searchDestinationsByName } from '../../services/destinationService';
import { usePath } from '../../contexts/PathContext';

export default function SearchPanel({ setIsResultOpen, onShowResult }) {
  const { changeLanguage, language } = useLanguage();
  const { fetchPath } = usePath();
  
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');

    try {
      const results = await searchDestinationsByName(query);
      
      if (results.length === 0) {
        onShowResult(<p className="text-center text-gray-300">نتیجه‌ای یافت نشد.</p>);
      } else {
        onShowResult(
          results.map((shop, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-neutral-800 p-4 rounded-xl border border-gray-600"
              onClick={() => {
                const start = { x: 58, y: 185, z: 1 }; // جایگزین کن با مختصات واقعی
                const end = {
                  x: shop.entrance.x,
                  y: shop.entrance.y,
                  z: 1
                };
                fetchPath(start, end);
                setIsResultOpen(false);
              }}
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
      }

      setIsResultOpen(true);
    } catch (err) {
      console.error("❌ خطا در جستجو:", err);
      setError('مشکلی در جستجو پیش آمد.');
    } finally {
      setLoading(false);
    }
  };


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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="عبارتی برای جست‌وجو وارد کنید..."
          className="flex-1 px-4 py-2 rounded-xl text-black bg-white text-base md:text-2xl"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-2xl md:text-3xl text-white p-2 rounded-xl hover:bg-blue-500 transition"
        >
          {loading ? '...' : <MdSearch />}
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
      </div>

      {/* نمایش ارور */}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
