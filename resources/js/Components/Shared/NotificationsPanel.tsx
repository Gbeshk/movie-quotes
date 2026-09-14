import { notificationMessage } from '@/lib/notificationMessage';
import { AuthenticatedPageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function NotificationsPanel({ open }: { open: boolean }) {
    const { notifications } = usePage<AuthenticatedPageProps>().props;

    if (!open) {
        return null;
    }

    return (
        <div className="bg-profile-modal-bg border-modal-secondary-text absolute top-full right-0 z-50 mt-3 max-h-96 w-96 overflow-y-auto rounded-xl border">
            <p className="border-modal-secondary-text border-b px-6 py-4 text-xl leading-normal font-medium tracking-normal text-white">
                Notifications
            </p>
            {notifications.length === 0 && (
                <p className="text-modal-secondary-text px-6 py-4 text-base leading-normal font-normal tracking-normal">
                    No notifications yet
                </p>
            )}
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="border-modal-secondary-text flex flex-col gap-1 border-b px-6 py-4 last:border-b-0"
                >
                    <p className="text-base leading-normal font-normal tracking-normal text-white">
                        {notificationMessage(notification.data)}
                    </p>
                    <p className="text-modal-secondary-text text-xs leading-normal font-normal tracking-normal">
                        {new Date(notification.created_at).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
