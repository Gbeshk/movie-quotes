import { LiveNotification } from '@/types';
import { useEffect, useState } from 'react';

export function useLiveNotifications(userId: number, initialUnreadCount: number) {
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [syncedCount, setSyncedCount] = useState(initialUnreadCount);
    const [toasts, setToasts] = useState<{ id: number; notification: LiveNotification }[]>([]);

    if (initialUnreadCount !== syncedCount) {
        setSyncedCount(initialUnreadCount);
        setUnreadCount(initialUnreadCount);
    }

    useEffect(() => {
        const channel = window.Echo.private(`App.Models.User.${userId}`);

        channel.notification((notification: LiveNotification) => {
            const id = Date.now();

            setUnreadCount((count) => count + 1);
            setToasts((current) => [...current, { id, notification }]);

            setTimeout(() => {
                setToasts((current) => current.filter((toast) => toast.id !== id));
            }, 5000);
        });

        return () => {
            window.Echo.leave(`App.Models.User.${userId}`);
        };
    }, [userId]);

    return { unreadCount, setUnreadCount, toasts };
}
