import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import useTheme from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // جلوگیری از mismatch سمت سرور/کلاینت
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-500 transition-all duration-300 ${
        isDark
          ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
          : 'bg-gray-700 hover:bg-gray-600 text-white'
      }`}
    >
      {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
      <span className="font-medium">
        {isDark ? 'روشن' : 'تاریک'}
      </span>
    </button>
  );
}
