import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next
i18n
  .use(HttpBackend) // Load translations using HTTP
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Bind i18next to React
  .init({
    fallbackLng: 'es', // Default language (Spanish)
    debug: true, // Enable debug mode
    supportedLngs: ['en', 'es'], // Supported languages
    detection: {
      order: ['localStorage', 'navigator'], // Check localStorage first, then browser language
      lookupLocalStorage: 'i18nextLng', // Key for localStorage
      caches: ['localStorage'], // Cache language in localStorage
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
  });

export default i18n;