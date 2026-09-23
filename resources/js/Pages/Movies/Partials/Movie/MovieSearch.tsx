import SearchIcon from '@/Components/Shared/Icons/SearchIcon';
import { renderSearchPlaceholder } from '@/Components/Shared/renderSearchPlaceholder';
import { cn } from '@/lib/cn';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MovieSearch({
    search,
    onSearchChange,
}: {
    search: string;
    onSearchChange: (value: string) => void;
}) {
    const { t } = useTranslation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchOpen) {
            searchInputRef.current?.focus();
        }
    }, [isSearchOpen]);

    return (
        <div
            className={cn(
                'lg:max-movies-compact:w-full relative flex max-lg:hidden',
                isSearchOpen ? 'min-w-25 flex-1 flex-col' : 'shrink-0 items-center',
            )}
        >
            <div className="group flex min-w-0 items-center gap-4">
                <button
                    type="button"
                    onClick={() => !isSearchOpen && setIsSearchOpen(true)}
                    className={cn('shrink-0', !isSearchOpen && 'cursor-pointer')}
                >
                    <SearchIcon className="group-hover:text-modal-secondary-text" />
                </button>
                {isSearchOpen ? (
                    <div className="relative min-w-25 flex-1">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onBlur={() => setIsSearchOpen(false)}
                            className="text-input-bg relative z-10 w-full border-none bg-transparent p-0 text-xl leading-normal font-normal tracking-normal outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {search === '' && (
                            <p className="text-input-bg group-hover:text-modal-secondary-text pointer-events-none absolute inset-0 flex items-center overflow-hidden text-xl leading-normal font-normal tracking-normal whitespace-nowrap transition-colors duration-150">
                                {renderSearchPlaceholder(t('common.searchExpanded'))}
                            </p>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(true)}
                        className="text-input-bg group-hover:text-modal-secondary-text cursor-pointer border-0 bg-transparent p-0 text-xl leading-normal font-normal tracking-normal transition-colors duration-150"
                    >
                        {t('common.search')}
                    </button>
                )}
            </div>
            {isSearchOpen && <div className="bg-line absolute top-10 mt-2 h-px w-full" />}
        </div>
    );
}
