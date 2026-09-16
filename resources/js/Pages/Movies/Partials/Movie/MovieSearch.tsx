import SearchIcon from '@/Components/Shared/Icons/SearchIcon';
import { renderSearchPlaceholder } from '@/lib/renderSearchPlaceholder';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MovieSearch({ initialSearch }: { initialSearch: string }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(initialSearch);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const isFirstRender = useRef(true);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchOpen) {
            searchInputRef.current?.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route('movies.index'), search ? { search } : {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    if (isSearchOpen) {
        return (
            <div className="relative flex flex-col">
                <div className="flex items-center gap-4">
                    <SearchIcon />
                    <div className="relative w-120">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onBlur={() => setIsSearchOpen(false)}
                            className="text-input-bg relative z-10 w-full border-none bg-transparent p-0 text-xl leading-normal font-normal tracking-normal outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {search === '' && (
                            <p className="text-input-bg pointer-events-none absolute inset-0 flex items-center overflow-hidden text-xl leading-normal font-normal tracking-normal whitespace-nowrap">
                                {renderSearchPlaceholder(t('common.searchExpanded'))}
                            </p>
                        )}
                    </div>
                </div>
                <div className="bg-line absolute top-10 mt-2 h-px w-full" />
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsSearchOpen(true)}
            className="flex cursor-pointer items-center gap-4"
        >
            <SearchIcon />
            <p className="text-input-bg text-xl leading-normal font-normal tracking-normal">
                {t('common.search')}
            </p>
        </div>
    );
}
