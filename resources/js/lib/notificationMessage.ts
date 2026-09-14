import { LiveNotification } from '@/types';

export function notificationMessage(notification: LiveNotification): string {
    return notification.kind === 'like'
        ? `${notification.liker} liked your quote`
        : `${notification.commenter} commented on your quote`;
}
