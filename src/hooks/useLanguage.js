// src/hooks/useLanguage.js
import { useCallback, useEffect, useState } from 'react';
import i18n from 'i18next';

export default function useLanguage() {
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  }, []);

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return { language, changeLanguage };
}
