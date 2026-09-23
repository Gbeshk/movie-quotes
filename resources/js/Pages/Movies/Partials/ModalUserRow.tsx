import DefaultAvatarIcon from '@/Components/Shared/Icons/DefaultAvatarIcon';
import { cn } from '@/lib/cn';
import { AuthenticatedPageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function ModalUserRow({ avatarClassName }: { avatarClassName?: string }) {
    const user = usePage<AuthenticatedPageProps>().props.auth.user;

    return (
        <div className="mt-7.5 flex items-center gap-4 self-start px-8">
            <div
                className={cn(
                    'h-15 w-15 shrink-0 overflow-hidden rounded-full max-sm:h-10 max-sm:w-10',
                    avatarClassName,
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
            <p className="text-xl leading-6 font-normal tracking-normal text-white">
                {user.username}
            </p>
        </div>
    );
}
