import NotificationRow from '@/Components/Shared/NotificationRow';
import { AuthenticatedPageProps } from '@/types';
import { InfiniteScroll, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function NotificationsPanel({
    open,
    onViewQuote,
}: {
    open: boolean;
    onViewQuote: (quoteId: number) => void;
}) {
    const { t } = useTranslation();
    const { notifications } = usePage<AuthenticatedPageProps>().props;

    if (!open) {
        return null;
    }

    const markAllRead = () => {
        axios.post(route('notifications.read')).then(() => {
            router.reload({
                only: ['notifications', 'unreadNotificationsCount'],
                reset: ['notifications'],
            });
        });
    };

    return (
        <div className="w-notifications-panel absolute top-full -right-57 z-50 mt-9 min-w-200 rounded-xl bg-black px-8 pt-10 pb-13 max-lg:fixed max-lg:inset-x-4 max-lg:top-24 max-lg:mt-0 max-lg:w-auto max-lg:min-w-0 max-sm:inset-x-0 max-sm:top-21 max-sm:pt-6">
            <div className="flex items-center justify-between">
                <p className="text-3xl leading-normal font-medium text-white capitalize max-sm:text-xl">
                    {t('notifications.title')}
                </p>
                {notifications.data.length > 0 && (
                    <button
                        type="button"
                        onClick={markAllRead}
                        className="cursor-pointer text-xl leading-normal font-normal text-white underline max-sm:text-base"
                    >
                        {t('notifications.markAllRead')}
                    </button>
                )}
            </div>
            {notifications.data.length === 0 && (
                <p className="text-modal-secondary-text mt-6 text-xl leading-normal font-normal">
                    {t('notifications.empty')}
                </p>
            )}
            <div className="mt-6 max-h-163 overflow-y-auto">
                <InfiniteScroll data="notifications" className="flex flex-col gap-4">
                    {notifications.data.map((notification) => (
                        <NotificationRow
                            key={notification.id}
                            notification={notification}
                            onView={() => onViewQuote(notification.data.quote_id)}
                        />
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
}
