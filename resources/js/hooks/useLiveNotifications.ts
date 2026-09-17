import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function useLiveNotifications(userId: number, initialUnreadCount: number) {
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [syncedCount, setSyncedCount] = useState(initialUnreadCount);

    if (initialUnreadCount !== syncedCount) {
        setSyncedCount(initialUnreadCount);
        setUnreadCount(initialUnreadCount);
    }

    useEffect(() => {
        const channel = window.Echo.private(`App.Models.User.${userId}`);

        channel.notification(() => {
            router.reload({
                only: ['notifications', 'unreadNotificationsCount'],
                reset: ['notifications'],
            });
        });

        return () => {
            window.Echo.leave(`App.Models.User.${userId}`);
        };
    }, [userId]);

    return { unreadCount, setUnreadCount };
}
