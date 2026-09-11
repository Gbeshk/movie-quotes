import DefaultAvatarIcon from '@/Components/Shared/Icons/DefaultAvatarIcon';
import { cn } from '@/lib/cn';
import { User } from '@/types';

export default function UserAvatar({ user, className }: { user: User; className?: string }) {
    return (
        <div className={cn('h-13 w-13 shrink-0 overflow-hidden rounded-full', className)}>
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
    );
}
