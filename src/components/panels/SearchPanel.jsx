import { MdSearch } from 'react-icons/md';
import { useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import LocationButton from '../buttons/LocationButton';
import { searchDestinationsByName } from '../../services/destinationService';
import { usePath } from '../../contexts/PathContext';
import { findFloorOfDestination } from '../../lib/floorUtils';
import DestinationCard from '../cards/DestinationCard';
import { getMyStand } from '../../services/floorService';

export default function SearchPanel({ setIsResultOpen, onShowResult }) {
  const { changeLanguage, language } = useLanguage();
  const { updateDestination } = usePath();
  const myStand = getMyStand();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');

    try {
      const results = await searchDestinationsByName(query);

      if (results.data.length === 0) {
        onShowResult(<p className="text-center text-gray-300">نتیجه‌ای یافت نشد.</p>);
      } else {
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
    <div className="md:flex justify-between flex-col md:flex-row gap-4 px-10">
      {/* جستجو */}
      <div className="flex items-center gap-2 w-full md:w-1/2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="مقصدی برای جست‌وجو وارد کنید..."
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
