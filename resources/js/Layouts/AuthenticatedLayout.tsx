import Header from '@/Components/Shared/Header';
import DefaultAvatarIcon from '@/Components/Shared/Icons/DefaultAvatarIcon';
import FeedIcon from '@/Components/Shared/Icons/FeedIcon';
import MoviesIcon from '@/Components/Shared/Icons/MoviesIcon';
import { AuthenticatedPageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage<AuthenticatedPageProps>().props.auth.user;

    return (
        <div className="bg-gradient-dark min-h-screen pb-20">
            <Header background="bg-header-bg border-t border-modal-bg/20 backdrop-blur-[50px]" />
            <div className="mt-8 flex w-full gap-46.75 px-17.5">
                <div className="flex w-70 flex-col gap-10">
                    <Link href={route('profile.edit')} className="flex cursor-pointer gap-6">
                        <div className="border-danger h-15 w-15 shrink-0 overflow-hidden rounded-full border-2">
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
                        <div className="flex flex-col justify-center">
                            <p className="text-2xl leading-9 font-normal tracking-normal text-white">
                                {user.username}
                            </p>
                            <p className="text-base leading-6 font-normal tracking-normal text-white">
                                Edit your profile
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={route('feed')}
                        className="ml-2 flex cursor-pointer items-center gap-10"
                    >
                        <FeedIcon />
                        <p className="text-2xl leading-9 font-normal tracking-normal text-white">
                            News feed
                        </p>
                    </Link>

                    <Link
                        href={route('movies.index')}
                        className="ml-2.5 flex cursor-pointer items-center gap-10"
                    >
                        <MoviesIcon />
                        <p className="text-2xl leading-9 font-normal tracking-normal text-white">
                            List of movies
                        </p>
                    </Link>
                </div>

                <div className="flex-1">
                    {header}
                    {children}
                </div>
            </div>
        </div>
    );
}
