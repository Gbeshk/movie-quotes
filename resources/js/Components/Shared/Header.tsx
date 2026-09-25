import BurgerMenuIcon from '@/Components/Shared/Icons/BurgerMenuIcon';
import NotificationCaretIcon from '@/Components/Shared/Icons/NotificationCaretIcon';
import NotificationIcon from '@/Components/Shared/Icons/NotificationIcon';
import SearchIcon from '@/Components/Shared/Icons/SearchIcon';
import LanguageSwitcher from '@/Components/Shared/LanguageSwitcher';
import NotificationsPanel from '@/Components/Shared/NotificationsPanel';
import { cn } from '@/lib/cn';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Header({
    background = 'bg-black',
    onOpenLogin,
    onOpenRegister,
    unreadNotificationsCount = 0,
    onNotificationsRead,
    onViewQuote = () => {},
    onToggleNav,
    onOpenSearch,
    searchButtonClassName = 'hidden cursor-pointer max-sm:flex',
}: {
    background?: string;
    onOpenLogin?: () => void;
    onOpenRegister?: () => void;
    unreadNotificationsCount?: number;
    onNotificationsRead?: () => void;
    onViewQuote?: (quoteId: number) => void;
    onToggleNav?: () => void;
    onOpenSearch?: () => void;
    searchButtonClassName?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const closeNotifications = () => {
        if (unreadNotificationsCount > 0) {
            onNotificationsRead?.();
            axios.post(route('notifications.read')).then(() => {
                router.reload({ only: ['notifications'], reset: ['notifications'] });
            });
        }

        setIsNotificationsOpen(false);
    };

    const toggleNotifications = () => {
        if (isNotificationsOpen) {
            closeNotifications();
        } else {
            setIsNotificationsOpen(true);
        }
    };

    return (
        <div
            className={cn(
                'z-header relative flex w-full items-center px-17.5 py-6 max-sm:h-21 max-sm:py-0',
                auth.user ? 'max-sm:px-8' : 'max-sm:px-4',
                background,
            )}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                    {auth.user && (
                        <button
                            type="button"
                            onClick={onToggleNav}
                            className="hidden cursor-pointer max-lg:block"
                        >
                            <BurgerMenuIcon />
                        </button>
                    )}
                    <Link
                        href={route('welcome')}
                        className={cn(
                            'text-logo-text cursor-pointer text-base leading-normal font-medium tracking-normal uppercase max-sm:text-sm',
                            auth.user && 'max-lg:hidden',
                        )}
                    >
                        {t('header.logoText')}
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {onOpenSearch && (
                        <button
                            type="button"
                            onClick={onOpenSearch}
                            className={searchButtonClassName}
                        >
                            <SearchIcon className="max-lg:h-7 max-lg:w-7 max-sm:h-6 max-sm:w-6" />
                        </button>
                    )}
                    {auth.user && (
                        <div className="relative z-50">
                            <button
                                type="button"
                                onClick={toggleNotifications}
                                className="relative z-50 flex cursor-pointer items-center justify-center"
                            >
                                <NotificationIcon
                                    active={unreadNotificationsCount > 0}
                                    className="max-sm:h-6 max-sm:w-6"
                                />
                                {unreadNotificationsCount > 0 && (
                                    <span className="bg-notification-badge absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs leading-none font-medium text-white max-sm:h-5 max-sm:w-5">
                                        {unreadNotificationsCount}
                                    </span>
                                )}
                            </button>
                            {isNotificationsOpen && (
                                <div onClick={closeNotifications} className="fixed inset-0 z-40" />
                            )}
                            <NotificationsPanel
                                open={isNotificationsOpen}
                                onViewQuote={onViewQuote}
                            />
                            {isNotificationsOpen && (
                                <NotificationCaretIcon className="absolute top-10 -right-2 z-50" />
                            )}
                        </div>
                    )}
                    <LanguageSwitcher className="max-sm:hidden" />
                    {auth.user ? (
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex cursor-pointer items-center justify-center rounded border border-white px-5 py-1.5 text-base leading-normal font-normal tracking-normal text-white max-sm:hidden"
                        >
                            {t('header.logOut')}
                        </Link>
                    ) : (
                        <>
                            <button
                                onClick={onOpenRegister}
                                className="bg-sign-up-btn-bg flex h-9.5 cursor-pointer items-center justify-center rounded px-6.5 text-base leading-normal font-normal tracking-normal text-white max-sm:order-2 max-sm:px-4 max-sm:text-sm max-sm:whitespace-nowrap"
                            >
                                {t('header.signUp')}
                            </button>
                            <button
                                onClick={onOpenLogin}
                                className="flex h-9.5 cursor-pointer items-center justify-center rounded border border-white px-6.5 text-base leading-normal font-normal tracking-normal text-white max-sm:order-1 max-sm:px-4 max-sm:text-sm max-sm:whitespace-nowrap"
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
