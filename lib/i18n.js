import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

i18n
  .use(LanguageDetector) // <-- auto-detect language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: "en", // fallback if detected language is not available
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Optional: customize detection order
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"], // cache user language in localStorage
    },
  });

export default i18n;
