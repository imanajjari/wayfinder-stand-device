import useLanguage from '../../hooks/useLanguage';

export default function LanguageButtons() {
  const { changeLanguage, language } = useLanguage();

  const buttons = [
    { code: 'fa', label: 'فارسی' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  return (
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
    </div>
  );
}
