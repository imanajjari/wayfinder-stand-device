import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationFa from './locales/fa/translation.json';
import translationEn from './locales/en/translation.json';
import translationAr from './locales/ar/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: { translation: translationFa },
      en: { translation: translationEn },
      ar: { translation: translationAr },
    },
    lng: 'fa',
    fallbackLng: 'fa',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
