import DefaultAvatarIcon from '@/Components/Shared/Icons/DefaultAvatarIcon';
import NotificationCommentIcon from '@/Components/Shared/Icons/NotificationCommentIcon';
import NotificationHeartIcon from '@/Components/Shared/Icons/NotificationHeartIcon';
import { cn } from '@/lib/cn';
import { notificationAction, notificationActor } from '@/utils/notificationMessage';
import { timeAgo } from '@/utils/timeAgo';
import { StoredNotification } from '@/types';
import { useTranslation } from 'react-i18next';

export default function NotificationRow({
    notification,
    onView,
}: {
    notification: StoredNotification;
    onView: () => void;
}) {
    const { t } = useTranslation();

    return (
        <div
            onClick={onView}
            className="border-modal-secondary-text/50 flex cursor-pointer items-center rounded border py-4.5 pr-5 pl-6"
        >
            <div className="flex flex-col items-center gap-1">
                <div
                    className={cn(
                        'flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full max-sm:h-15 max-sm:w-15',
                        notification.read_at === null && 'border-success border-2',
                    )}
                >
                    {notification.data.avatar_url ? (
                        <img
                            src={notification.data.avatar_url}
                            alt={notificationActor(notification.data)}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <DefaultAvatarIcon />
                    )}
                </div>
                <p
                    className={cn(
                        'text-success hidden text-xl leading-normal font-normal max-sm:mt-2 max-sm:block',
                        notification.read_at !== null && 'invisible',
                    )}
                >
                    {t('notifications.new')}
                </p>
            </div>
            <div className="ml-6 flex min-w-0 flex-1 flex-col justify-center gap-1">
                <p className="text-xl leading-normal font-normal text-white">
                    {notificationActor(notification.data)}
                </p>
                <div className="flex min-w-0 items-center gap-2">
                    {notification.data.kind === 'like' ? (
                        <NotificationHeartIcon />
                    ) : (
                        <NotificationCommentIcon />
                    )}
                    <p className="text-input-bg min-w-0 text-xl leading-normal font-normal max-sm:truncate">
                        {notificationAction(notification.data, t)}
                    </p>
                </div>
                <p className="text-landing-movie-name hidden text-xl leading-normal font-normal whitespace-nowrap max-sm:mt-2 max-sm:block">
                    {timeAgo(notification.created_at, t)}
                </p>
            </div>
            <div className="ml-auto flex h-16 flex-col gap-1 max-sm:hidden">
                <p className="text-landing-movie-name text-xl leading-normal font-normal">
                    {timeAgo(notification.created_at, t)}
                </p>
                {notification.read_at === null && (
                    <p className="text-success ml-auto text-xl leading-normal font-normal">
                        {t('notifications.new')}
                    </p>
                )}
            </div>
        </div>
    );
}
