import DefaultAvatarIcon from '@/Components/Shared/Icons/DefaultAvatarIcon';
import { AuthenticatedPageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function MovieModalUserRow() {
    const user = usePage<AuthenticatedPageProps>().props.auth.user;

    return (
        <div className="mt-7.5 flex items-center gap-4 self-start px-8">
            <div className="h-15 w-15 shrink-0 overflow-hidden rounded-full">
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
