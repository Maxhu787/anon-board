import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

import enPrivacy from "./locales/en/privacy.json";
import zhPrivacy from "./locales/zh/privacy.json";

import enTos from "./locales/en/tos.json";
import zhTos from "./locales/zh/tos.json";

import enAbout from "./locales/en/about.json";
import zhAbout from "./locales/zh/about.json";

i18n
  .use(LanguageDetector) // <-- auto-detect language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en, privacy: enPrivacy, tos: enTos, about: enAbout },
      zh: { translation: zh, privacy: zhPrivacy, tos: zhTos, about: zhAbout },
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
