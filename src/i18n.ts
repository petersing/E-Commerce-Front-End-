import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en_us from './assets/Language/en-us/en-US.json'
import zh_tw from './assets/Language/zh-tw/zh-TW.json'


const resources = {
    en_US: {
      translation: en_us,
    },
    zh_TW: {
      translation: zh_tw,
    }
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'en_US',
    fallbackLng: 'en_US',
    interpolation: {
      escapeValue: false,
    },
  });
  
export default i18n;
