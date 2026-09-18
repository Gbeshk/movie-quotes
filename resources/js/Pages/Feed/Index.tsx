import AddPostIcon from '@/Components/Shared/Icons/AddPostIcon';
import SearchIcon from '@/Components/Shared/Icons/SearchIcon';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/cn';
import { renderSearchPlaceholder } from '@/Components/Shared/renderSearchPlaceholder';
import AddQuoteModal from '@/Pages/Feed/Partials/AddQuoteModal';
import Post from '@/Pages/Feed/Partials/Post';
import { Paginated, Quote } from '@/types';
import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Index({
    quotes,
    search: initialSearch,
}: {
    quotes: Paginated<Quote>;
    search: string;
}) {
    const { t } = useTranslation();
    const [showAddQuote, setShowAddQuote] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route('feed'), search ? { search } : {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['quotes'],
                reset: ['quotes'],
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <AuthenticatedLayout>
            <Head title={t('feed.title')} />
            <AddQuoteModal show={showAddQuote} onClose={() => setShowAddQuote(false)} />
            <div className="flex h-13 w-3/4 items-center justify-between">
                <button
                    type="button"
                    onClick={() => setShowAddQuote(true)}
                    className={cn(
                        'bg-header-bg/60 flex h-full shrink-0 cursor-pointer items-center gap-4 rounded-xl px-4',
                        isSearchOpen ? 'w-fit' : 'w-5/6',
                    )}
                >
                    <AddPostIcon />
                    <p className="text-xl leading-normal text-white">{t('feed.writeNewQuote')}</p>
                </button>
                <div
                    className={cn(
                        'flex min-w-0 items-center gap-4',
                        isSearchOpen ? 'relative ml-4 flex-1' : 'shrink',
                    )}
                >
                    <SearchIcon />
                    <div className={cn('relative min-w-0', isSearchOpen ? 'flex-1' : 'w-24')}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setIsSearchOpen(true)}
                            onBlur={() => setIsSearchOpen(false)}
                            className={cn(
                                'text-input-bg relative z-10 w-full min-w-0 border-none bg-transparent p-0 leading-normal font-normal tracking-normal outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                                isSearchOpen ? 'text-2xl' : 'cursor-pointer text-xl',
                            )}
                        />
                        {search === '' && (
                            <p className="text-input-bg pointer-events-none absolute inset-0 flex items-center overflow-hidden text-xl leading-normal font-normal tracking-normal whitespace-nowrap">
                                {isSearchOpen
                                    ? renderSearchPlaceholder(t('common.searchExpanded'))
                                    : t('common.search')}
                            </p>
                        )}
                    </div>
                    {isSearchOpen && <div className="bg-line absolute top-10 mt-2 h-px w-full" />}
                </div>
            </div>
            <InfiniteScroll
                data="quotes"
                className="mt-5.5 flex w-3/4 flex-col gap-10"
                next={({ hasNext }) =>
                    !hasNext && (
                        <p className="text-modal-secondary-text w-3/4 py-6 text-center text-base leading-normal font-normal tracking-normal">
                            {search !== '' && quotes.data.length === 0
                                ? t('feed.noResults')
                                : t('feed.noMorePosts')}
                        </p>
                    )
                }
            >
                {quotes.data.map((quote) => (
                    <Post key={quote.id} quote={quote} />
                ))}
            </InfiniteScroll>
        </AuthenticatedLayout>
    );
}
