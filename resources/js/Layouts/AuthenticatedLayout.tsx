import Header from '@/Components/Shared/Header';
import { cn } from '@/lib/cn';
import { AuthenticatedPageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage<AuthenticatedPageProps>().props.auth.user;

    const navItems = [
        {
            label: 'Profile',
            href: route('profile.edit'),
            active: route().current('profile.*'),
        },
        {
            label: 'News Feed',
            href: route('feed'),
            active: route().current('feed'),
        },
        {
            label: 'Your Movies',
            href: route('movies.index'),
            active: route().current('movies.*'),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Header background="bg-modal-bg border border-modal-bg/20 backdrop-blur-[50px]" />

            <div className="flex">
                <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
                    <div className="truncate px-6 py-6 text-sm font-medium text-gray-800">
                        {user.username}
                    </div>

                    <nav className="flex flex-1 flex-col gap-1 px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm font-medium',
                                    item.active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <div className="flex flex-1 flex-col">
                    {header && <div className="px-4 py-6 sm:px-6 lg:px-8">{header}</div>}

                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
