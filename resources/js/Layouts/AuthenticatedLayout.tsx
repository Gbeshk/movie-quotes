import Header from '@/Components/Shared/Header';
import { useLiveNotifications } from '@/hooks/useLiveNotifications';
import { useQuoteModals } from '@/hooks/useQuoteModals';
import NavigationDrawer from '@/Layouts/Partials/NavigationDrawer';
import { cn } from '@/lib/cn';
import { AuthenticatedPageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
    onOpenSearch,
    searchButtonClassName,
    contentShrink0 = true,
}: {
    header?: ReactNode;
    children: ReactNode | ((isNavOpen: boolean) => ReactNode);
    onOpenSearch?: () => void;
    searchButtonClassName?: string;
    contentShrink0?: boolean;
}) {
    const { auth, unreadNotificationsCount } = usePage<AuthenticatedPageProps>().props;
    const user = auth.user;
    const { unreadCount, setUnreadCount } = useLiveNotifications(user.id, unreadNotificationsCount);
    const { viewQuote, quoteModals } = useQuoteModals(user.id);
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <div className="bg-gradient-dark min-h-screen overflow-x-hidden bg-black pb-20">
            <Header
                background="bg-header-bg border-t border-modal-bg/20 backdrop-blur-50"
                unreadNotificationsCount={unreadCount}
                onNotificationsRead={() => setUnreadCount(0)}
                onViewQuote={viewQuote}
                onToggleNav={() => setIsNavOpen((open) => !open)}
                onOpenSearch={onOpenSearch}
                searchButtonClassName={searchButtonClassName}
            />

            {quoteModals}

            <div className="mt-8 flex w-full px-17.5 max-sm:mt-0 max-sm:px-8">
                <NavigationDrawer
                    user={user}
                    isOpen={isNavOpen}
                    onClose={() => setIsNavOpen(false)}
                />

                <div className={cn('w-full', contentShrink0 && 'shrink-0')}>
                    {header}
                    {typeof children === 'function' ? children(isNavOpen) : children}
                </div>
            </div>
        </div>
    );
}
