import CloseIcon from '@/Components/Shared/Icons/CloseIcon';
import DefaultAvatarIcon from '@/Components/Shared/Icons/DefaultAvatarIcon';
import FeedIcon from '@/Components/Shared/Icons/FeedIcon';
import MoviesIcon from '@/Components/Shared/Icons/MoviesIcon';
import LanguageSwitcher from '@/Components/Shared/LanguageSwitcher';
import { useSwipeToClose } from '@/hooks/useSwipeToClose';
import { cn } from '@/lib/cn';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NavigationDrawer({
    user,
    isOpen,
    onClose,
}: {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const [hasOpened, setHasOpened] = useState(false);
    const { onTouchStart, onTouchEnd } = useSwipeToClose(onClose);

    if (isOpen && !hasOpened) {
        setHasOpened(true);
    }

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="z-drawer fixed inset-0 hidden bg-black/50 max-lg:block"
                />
            )}
            <div
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className={cn(
                    'max-lg:bg-profile-modal-bg flex w-71 shrink-0 flex-col gap-10 max-lg:fixed max-lg:top-0 max-lg:right-8 max-lg:left-0 max-lg:h-150 max-lg:w-auto max-lg:rounded-r-xl max-lg:px-8 max-lg:py-10',
                    isOpen && 'z-drawer',
                    hasOpened && 'transition-transform duration-300 ease-in-out',
                    !isOpen && 'max-lg:-translate-x-full',
                )}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 hidden cursor-pointer max-lg:block"
                >
                    <CloseIcon />
                </button>

                <Link
                    href={route('profile.edit')}
                    className="flex cursor-pointer items-center gap-6"
                >
                    <div
                        className={cn(
                            'h-15 w-15 shrink-0 overflow-hidden rounded-full max-sm:h-10 max-sm:w-10',
                            route().current('profile.edit') && 'border-danger border-2',
                        )}
                    >
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.username}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <DefaultAvatarIcon />
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-2xl leading-9 font-normal tracking-normal text-white max-sm:text-xl">
                            {user.username}
                        </p>
                        <p className="text-base leading-6 font-normal tracking-normal text-white">
                            {t('nav.editProfile')}
                        </p>
                    </div>
                </Link>

                <Link
                    href={route('feed')}
                    className="ml-2 flex cursor-pointer items-center gap-10 max-sm:ml-0 max-sm:gap-6"
                >
                    <FeedIcon active={route().current('feed')} className="max-sm:h-6 max-sm:w-6" />
                    <p className="text-2xl leading-9 font-normal tracking-normal text-white max-sm:text-xl">
                        {t('nav.newsFeed')}
                    </p>
                </Link>

                <Link
                    href={route('movies.index')}
                    className="ml-2.5 flex cursor-pointer items-center gap-10 max-sm:ml-0 max-sm:gap-6"
                >
                    <MoviesIcon
                        active={route().current('movies.*')}
                        className="max-sm:h-6 max-sm:w-6"
                    />
                    <p className="text-2xl leading-9 font-normal tracking-normal text-white max-sm:text-xl">
                        {t('nav.movies')}
                    </p>
                </Link>

                <LanguageSwitcher
                    className="ml-2 hidden max-sm:ml-0 max-sm:block"
                    buttonClassName="px-0"
                    dropdownClassName="left-0"
                />

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="ml-2 hidden cursor-pointer items-center gap-10 max-sm:ml-0 max-sm:flex"
                >
                    <p className="text-2xl leading-9 font-normal tracking-normal text-white max-sm:text-xl">
                        {t('header.logOut')}
                    </p>
                </Link>
            </div>
        </>
    );
}
