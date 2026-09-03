import ArrowDown from '@/Components/Shared/Icons/ArrowDown';
import NotificationIcon from '@/Components/Shared/Icons/NotificationIcon';
import { cn } from '@/lib/cn';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function Header({
    background = 'bg-black',
    onOpenLogin,
    onOpenRegister,
}: {
    background?: string;
    onOpenLogin?: () => void;
    onOpenRegister?: () => void;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className={cn('w-full px-17.5 py-6', background)}>
            <div className="flex items-center justify-between">
                <Link
                    href={route('welcome')}
                    className="text-logo-text cursor-pointer text-base leading-normal font-medium tracking-normal uppercase"
                >
                    Movie quotes
                </Link>
                <div className="flex items-center gap-4">
                    {auth.user && (
                        <button
                            type="button"
                            className="flex cursor-pointer items-center justify-center"
                        >
                            <NotificationIcon />
                        </button>
                    )}
                    <div className="flex cursor-pointer items-center justify-center gap-2 px-5.5">
                        <p className="text-base leading-normal font-normal tracking-normal text-white">
                            Eng
                        </p>
                        <ArrowDown />
                    </div>
                    {auth.user ? (
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex cursor-pointer items-center justify-center rounded border border-white px-5 py-1.5 text-base leading-normal font-normal tracking-normal text-white"
                        >
                            Log out
                        </Link>
                    ) : (
                        <>
                            <button
                                onClick={onOpenRegister}
                                className="bg-sign-up-btn-bg flex cursor-pointer items-center justify-center rounded px-6.5 py-1.75 text-base leading-normal font-normal tracking-normal text-white"
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={onOpenLogin}
                                className="flex cursor-pointer items-center justify-center rounded border border-white px-6.5 py-1.75 text-base leading-normal font-normal tracking-normal text-white"
                            >
                                Log in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
