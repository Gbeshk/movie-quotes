import { SupportedLanguage } from '@/lib/i18n';
import { Translatable } from '@/types';
import { useTranslation } from 'react-i18next';

export function useTranslatable() {
    const { i18n } = useTranslation();
    const language = i18n.language as SupportedLanguage;

    return (value: Translatable): string => value[language] ?? value.en;
}
