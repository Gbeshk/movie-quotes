import ArrowDown from '@/Components/Shared/Icons/ArrowDown';
import { cn } from '@/lib/cn';
import { SupportedLanguage } from '@/lib/i18n';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'Eng' },
    { code: 'ka', label: 'ქარ' },
];

export default function LanguageSwitcher({
    className,
    buttonClassName = 'px-5.5',
    dropdownClassName = 'right-0',
}: {
    className?: string;
    buttonClassName?: string;
    dropdownClassName?: string;
}) {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const currentLanguage =
        LANGUAGES.find((language) => language.code === i18n.language) ?? LANGUAGES[0];

    return (
        <div className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className={cn('flex cursor-pointer items-center gap-2', buttonClassName)}
            >
                <p className="text-base leading-normal font-normal tracking-normal text-white">
                    {currentLanguage.label}
                </p>
                <ArrowDown />
            </button>

            {isOpen && (
                <div
                    className={cn(
                        'bg-profile-modal-bg border-modal-secondary-text absolute top-full z-50 mt-2 w-24 overflow-hidden rounded-lg border',
                        dropdownClassName,
                    )}
                >
                    {LANGUAGES.map((language) => (
                        <button
                            key={language.code}
                            type="button"
                            onClick={() => {
                                i18n.changeLanguage(language.code);
                                setIsOpen(false);
                            }}
                            className="block w-full cursor-pointer px-4 py-2 text-left text-base leading-normal font-normal tracking-normal text-white hover:bg-white/10"
                        >
                            {language.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
