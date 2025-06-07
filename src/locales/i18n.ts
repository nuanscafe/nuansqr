import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './en/translation.json';
import ruTranslation from './ru/translation.json';
import deTranslation from './de/translation.json';
import frTranslation from './fr/translation.json';
import trTranslation from './tr/translation.json'; // Assuming Turkish is the default/existing language

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
      de: {
        translation: deTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      tr: {
        translation: trTranslation,
      },
    },
    lng: 'tr', // Default language
    fallbackLng: 'en', // Fallback language if a translation is missing
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
