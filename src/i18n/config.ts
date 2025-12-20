import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import nl from './locales/nl.json'
import tr from './locales/tr.json'
import en from './locales/en.json'
import de from './locales/de.json'



i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      nl: { translation: nl },
      tr: { translation: tr },
      en: { translation: en },
      de: { translation: de },

    },
    fallbackLng: 'nl',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n
