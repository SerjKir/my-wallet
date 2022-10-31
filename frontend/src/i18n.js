import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import ua from './locales/ua/translation.json';
import en from './locales/en/translation.json';

const resources = {
  ua: {
    translation: ua
  },
  en: {
    translation: en
  }
};
const supportedLngs = ['ua', 'en'];
const fallbackLng = 'ua';


i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs,
    fallbackLng
  });

export default i18n;