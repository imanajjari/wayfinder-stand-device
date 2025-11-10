import { MdSearch } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';
import { useEffect, useState } from 'react';
import LocationButton from '../buttons/LocationButton';
import ThemeToggle from '../buttons/ThemeToggle';
import LanguageDropdown from '../buttons/LanguageDropdown';
import { searchDestinationsByName } from '../../services/destinationService';
import { useSearchResults } from '../../contexts/SearchResultsContext';
import { t } from 'i18next';

export default function SearchPanel() {
  const { showResults, setLoading, loading } = useSearchResults();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;
    const timeout = setTimeout(() => {
      searchDestinationsByName(query).then(res => {
        // اینجا مثلا نتایج پیشنهادی رو توی state نگه دار
      });
    }, 500);

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

  return (
    <div className="flex justify-between md:flex-row gap-4 px-3">
      {/* جستجو */}
      <div className="flex items-center gap-2 w-full md:w-1/2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={t('Navigator3DPage.search_placeholder')}
          className="w-1/2 flex-1 px-4 py-2 rounded-xl text-[#ffffff] bg-[#324154] text-base md:text-2xl "
        />
        <button
          onClick={handleSearch}
          className=" bg-[#00FFAB] 
                  shadow-[0_0_30px_#00FFAA8D] text-xl sm:text-2xl md:text-3xl text-black p-2 rounded-xl hover:bg-blue-500 active:scale-95 hover:scale-110 transition-transform duration-200"
        >
          {loading ? <ImSpinner8 className="animate-spin" /> : <MdSearch />}
        </button>
      </div>

      {/* دکمه‌های زبان + موقعیت + تم */}
      <div className="flex justify-center gap-2 items-center">
        <LanguageDropdown />
        <LocationButton />
        {/* <ThemeToggle /> */}
      </div>

      {/* نمایش ارور */}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
