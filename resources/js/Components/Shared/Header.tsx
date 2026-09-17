import ArrowDown from '@/Components/Shared/Icons/ArrowDown';
import NotificationIcon from '@/Components/Shared/Icons/NotificationIcon';
import NotificationsPanel from '@/Components/Shared/NotificationsPanel';
import { cn } from '@/lib/cn';
import { SupportedLanguage } from '@/lib/i18n';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'Eng' },
    { code: 'ka', label: 'ქარ' },
];

export default function Header({
    background = 'bg-black',
    onOpenLogin,
    onOpenRegister,
    unreadNotificationsCount = 0,
    onNotificationsRead,
    onViewQuote = () => {},
}: {
    background?: string;
    onOpenLogin?: () => void;
    onOpenRegister?: () => void;
    unreadNotificationsCount?: number;
    onNotificationsRead?: () => void;
    onViewQuote?: (quoteId: number) => void;
}) {
    const { auth } = usePage<PageProps>().props;
    const { t, i18n } = useTranslation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const currentLanguage =
        LANGUAGES.find((language) => language.code === i18n.language) ?? LANGUAGES[0];

    const toggleNotifications = () => {
        const willOpen = !isNotificationsOpen;

        setIsNotificationsOpen(willOpen);

        if (willOpen && unreadNotificationsCount > 0) {
            onNotificationsRead?.();
            axios.post(route('notifications.read')).then(() => {
                router.reload({ only: ['notifications'], reset: ['notifications'] });
            });
        }
    };

    return (
        <div className={cn('relative z-50 w-full px-17.5 py-6 max-sm:px-4', background)}>
            <div className="flex items-center justify-between">
                <Link
                    href={route('welcome')}
                    className="text-logo-text cursor-pointer text-base leading-normal font-medium tracking-normal uppercase max-sm:text-sm"
                >
                    {t('header.logoText')}
                </Link>
                <div className="flex items-center gap-4">
                    {auth.user && (
                        <div className="relative z-50">
                            <button
                                type="button"
                                onClick={toggleNotifications}
                                className="relative flex cursor-pointer items-center justify-center"
                            >
                                <NotificationIcon active={unreadNotificationsCount > 0} />
                                {unreadNotificationsCount > 0 && (
                                    <span className="bg-danger absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-xs leading-none font-medium text-white">
                                        {unreadNotificationsCount}
                                    </span>
                                )}
                            </button>
                            <NotificationsPanel
                                open={isNotificationsOpen}
                                onViewQuote={onViewQuote}
                            />
                        </div>
                    )}
                    <div className="relative max-sm:hidden">
                        <button
                            type="button"
                            onClick={() => setIsLanguageOpen((open) => !open)}
                            className="flex cursor-pointer items-center justify-center gap-2 px-5.5"
                        >
                            <p className="text-base leading-normal font-normal tracking-normal text-white">
                                {currentLanguage.label}
                            </p>
                            <ArrowDown />
                        </button>

                        {isLanguageOpen && (
                            <div className="bg-profile-modal-bg border-modal-secondary-text absolute top-full right-0 z-50 mt-2 w-24 overflow-hidden rounded-lg border">
                                {LANGUAGES.map((language) => (
                                    <button
                                        key={language.code}
                                        type="button"
                                        onClick={() => {
                                            i18n.changeLanguage(language.code);
                                            setIsLanguageOpen(false);
                                        }}
                                        className="block w-full cursor-pointer px-4 py-2 text-left text-base leading-normal font-normal tracking-normal text-white hover:bg-white/10"
                                    >
                                        {language.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {auth.user ? (
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex cursor-pointer items-center justify-center rounded border border-white px-5 py-1.5 text-base leading-normal font-normal tracking-normal text-white max-sm:text-sm"
                        >
                            {t('header.logOut')}
                        </Link>
                    ) : (
                        <>
                            <button
                                onClick={onOpenRegister}
                                className="bg-sign-up-btn-bg flex h-9.5 cursor-pointer items-center justify-center rounded px-6.5 py-1.75 text-base leading-normal font-normal tracking-normal text-white max-sm:order-2 max-sm:h-8 max-sm:w-20 max-sm:px-2 max-sm:text-sm max-sm:whitespace-nowrap"
                            >
                                {t('header.signUp')}
                            </button>
                            <button
                                onClick={onOpenLogin}
                                className="flex h-9.5 cursor-pointer items-center justify-center rounded border border-white px-6.5 py-1.75 text-base leading-normal font-normal tracking-normal text-white max-sm:order-1 max-sm:h-8 max-sm:w-18 max-sm:px-2 max-sm:text-sm max-sm:whitespace-nowrap"
                            >
                                {t('header.logIn')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
