import { LiveNotification } from '@/types';
import { TFunction } from 'i18next';

export function notificationActor(notification: LiveNotification): string {
    return notification.kind === 'like' ? notification.liker : notification.commenter;
}

export function notificationAction(notification: LiveNotification, t: TFunction): string {
    return t(
        notification.kind === 'like' ? 'notifications.likeAction' : 'notifications.commentAction',
    );
}
