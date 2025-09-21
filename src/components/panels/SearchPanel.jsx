import { MdSearch } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';
import { useEffect, useState } from 'react';
import useLanguage from '../../hooks/useLanguage';
import LocationButton from '../buttons/LocationButton';
import ThemeToggle from '../buttons/ThemeToggle';
import { searchDestinationsByName } from '../../services/destinationService';
import { useSearchResults } from '../../contexts/SearchResultsContext';

export default function SearchPanel() {
  const { changeLanguage, language } = useLanguage();
  const { showResults, setLoading, loading } = useSearchResults();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;
    const timeout = setTimeout(() => {
      searchDestinationsByName(query).then(res => {
        // اینجا مثلا نتایج پیشنهادی رو توی state نگه دار
      });
    }, 500); // نصف ثانیه دیلی
  
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');

    try {
      const results = await searchDestinationsByName(query);
      showResults(results.data, `نتایج جستجو: "${query}"`);
    } catch (err) {
      console.error("❌ خطا در جستجو:", err);
      setError('مشکلی در جستجو پیش آمد.');
      showResults([], 'خطا در جستجو');
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
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="مقصدی برای جست‌وجو وارد کنید..."
          className="flex-1 px-4 py-2 rounded-xl text-black bg-white text-base md:text-2xl"
        />
<button
  onClick={handleSearch}
  className="bg-blue-600 text-2xl md:text-3xl text-white p-2 rounded-xl hover:bg-blue-500 active:scale-95 hover:scale-110 transition-transform duration-200"
>
  {loading ? <ImSpinner8 className="animate-spin" /> : <MdSearch />}
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
        <ThemeToggle />
      </div>

      {/* نمایش ارور */}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
