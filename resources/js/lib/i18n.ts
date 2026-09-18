import en from '@/locales/en.json';
import ka from '@/locales/ka.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const SUPPORTED_LANGUAGES = ['en', 'ka'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ka: { translation: ka },
        },
        fallbackLng: 'en',
        supportedLngs: SUPPORTED_LANGUAGES,
        load: 'languageOnly',
        interpolation: { escapeValue: false },
        detection: {
            order: ['cookie', 'navigator'],
            caches: ['cookie'],
            lookupCookie: 'locale',
            cookieMinutes: 525600,
        },
    });

export default i18n;
