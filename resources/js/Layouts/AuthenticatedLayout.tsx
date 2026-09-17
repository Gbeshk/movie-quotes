import Header from '@/Components/Shared/Header';
import DefaultAvatarIcon from '@/Components/Shared/Icons/DefaultAvatarIcon';
import FeedIcon from '@/Components/Shared/Icons/FeedIcon';
import MoviesIcon from '@/Components/Shared/Icons/MoviesIcon';
import { useLiveNotifications } from '@/hooks/useLiveNotifications';
import { cn } from '@/lib/cn';
import ViewQuoteModal from '@/Pages/Movies/Partials/Quote/ViewQuoteModal';
import { AuthenticatedPageProps, Quote } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { t } = useTranslation();
    const { auth, unreadNotificationsCount } = usePage<AuthenticatedPageProps>().props;
    const user = auth.user;
    const { unreadCount, setUnreadCount } = useLiveNotifications(user.id, unreadNotificationsCount);
    const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);

    const viewQuote = (quoteId: number) => {
        axios.get<Quote>(route('quotes.show', quoteId)).then((response) => {
            setViewingQuote(response.data);
        });
    };

    return (
        <div className="bg-gradient-dark min-h-screen bg-black pb-20">
            <Header
                background="bg-header-bg border-t border-modal-bg/20 backdrop-blur-[50px]"
                unreadNotificationsCount={unreadCount}
                onNotificationsRead={() => setUnreadCount(0)}
                onViewQuote={viewQuote}
            />

            {viewingQuote && (
                <ViewQuoteModal
                    show
                    onClose={() => setViewingQuote(null)}
                    quote={viewingQuote}
                    isAuthor={viewingQuote.user_id === user.id}
                    onEdit={() => router.visit(route('movies.show', viewingQuote.movie_id))}
                    onDelete={() => router.visit(route('movies.show', viewingQuote.movie_id))}
                />
            )}
            <div className="mt-8 flex w-full gap-46.75 px-17.5">
                <div className="flex w-70 flex-col gap-10">
                    <Link href={route('profile.edit')} className="flex cursor-pointer gap-6">
                        <div
                            className={cn(
                                'h-15 w-15 shrink-0 overflow-hidden rounded-full',
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
                            <p className="text-2xl leading-9 font-normal tracking-normal text-white">
                                {user.username}
                            </p>
                            <p className="text-base leading-6 font-normal tracking-normal text-white">
                                {t('nav.editProfile')}
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={route('feed')}
                        className="ml-2 flex cursor-pointer items-center gap-10"
                    >
                        <FeedIcon active={route().current('feed')} />
                        <p className="text-2xl leading-9 font-normal tracking-normal text-white">
                            {t('nav.newsFeed')}
                        </p>
                    </Link>

                    <Link
                        href={route('movies.index')}
                        className="ml-2.5 flex cursor-pointer items-center gap-10"
                    >
                        <MoviesIcon active={route().current('movies.*')} />
                        <p className="text-2xl leading-9 font-normal tracking-normal text-white">
                            {t('nav.movies')}
                        </p>
                    </Link>
                </div>

                <div className="flex-1">
                    {header}
                    {children}
                </div>
            </div>
        </div>
    );
}
