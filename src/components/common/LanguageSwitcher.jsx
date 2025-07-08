// src/components/LanguageSwitcher.jsx
import React from 'react';
import useLanguage from '../../hooks/useLanguage';


export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div>
      <button onClick={() => changeLanguage('en')} disabled={language === 'en'}>
        English
      </button>
      <button onClick={() => changeLanguage('fa')} disabled={language === 'fa'}>
        فارسی
      </button>
    </div>
  );
}
