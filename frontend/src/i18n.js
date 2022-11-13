import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk/translation.json';
import en from './locales/en/translation.json';

const resources = {
  uk: {
    translation: uk
  },
  en: {
    translation: en
  }
};
const supportedLngs = ['uk', 'en'];
const fallbackLng = 'uk';

i18n
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs,
    fallbackLng
  });

export default i18n;