import ArrowDown from '@/Components/Shared/Icons/ArrowDown';
import NotificationIcon from '@/Components/Shared/Icons/NotificationIcon';
import NotificationsPanel from '@/Components/Shared/NotificationsPanel';
import { cn } from '@/lib/cn';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function Header({
    background = 'bg-black',
    onOpenLogin,
    onOpenRegister,
    unreadNotificationsCount = 0,
    onNotificationsRead,
}: {
    background?: string;
    onOpenLogin?: () => void;
    onOpenRegister?: () => void;
    unreadNotificationsCount?: number;
    onNotificationsRead?: () => void;
}) {
    const { auth } = usePage<PageProps>().props;
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const toggleNotifications = () => {
        const willOpen = !isNotificationsOpen;

        setIsNotificationsOpen(willOpen);

        if (willOpen && unreadNotificationsCount > 0) {
            onNotificationsRead?.();
            axios.post(route('notifications.read'));
        }
    };

    return (
        <div className={cn('relative z-50 w-full px-17.5 py-6', background)}>
            <div className="flex items-center justify-between">
                <Link
                    href={route('welcome')}
                    className="text-logo-text cursor-pointer text-base leading-normal font-medium tracking-normal uppercase"
                >
                    Movie quotes
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
                            <NotificationsPanel open={isNotificationsOpen} />
                        </div>
                    )}
                    <div className="flex cursor-pointer items-center justify-center gap-2 px-5.5">
                        <p className="text-base leading-normal font-normal tracking-normal text-white">
                            Eng
                        </p>
                        <ArrowDown />
                    </div>
                    {auth.user ? (
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex cursor-pointer items-center justify-center rounded border border-white px-5 py-1.5 text-base leading-normal font-normal tracking-normal text-white"
                        >
                            Log out
                        </Link>
                    ) : (
                        <>
                            <button
                                onClick={onOpenRegister}
                                className="bg-sign-up-btn-bg flex cursor-pointer items-center justify-center rounded px-6.5 py-1.75 text-base leading-normal font-normal tracking-normal text-white"
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={onOpenLogin}
                                className="flex cursor-pointer items-center justify-center rounded border border-white px-6.5 py-1.75 text-base leading-normal font-normal tracking-normal text-white"
                            >
                                Log in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
