import { notificationMessage } from '@/lib/notificationMessage';
import { LiveNotification } from '@/types';

export default function NotificationToasts({
    toasts,
}: {
    toasts: { id: number; notification: LiveNotification }[];
}) {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="bg-profile-modal-bg border-modal-secondary-text rounded-xl border px-6 py-4 text-base leading-normal font-normal tracking-normal text-white shadow-lg"
                >
                    {notificationMessage(toast.notification)}
                </div>
            ))}
        </div>
    );
}
