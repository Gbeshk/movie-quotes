import ArrowDown from '@/Components/Shared/Icons/ArrowDown';
import MoviesIcon from '@/Components/Shared/Icons/MoviesIcon';
import SearchIcon from '@/Components/Shared/Icons/SearchIcon';
import { useTranslatable } from '@/lib/translatable';
import { AuthenticatedPageProps, Movie } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MoviePicker({
    onSelect,
    autoOpen = false,
}: {
    onSelect: (movie: Movie) => void;
    autoOpen?: boolean;
}) {
    const { t } = useTranslation();
    const translate = useTranslatable();
    const { movieOptions } = usePage<AuthenticatedPageProps<{ movieOptions?: Movie[] }>>().props;
    const results = movieOptions ?? [];
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(autoOpen);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.reload({
                data: { movie_search: query },
                only: ['movieOptions'],
                preserveUrl: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="relative mt-6 w-full px-8">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="flex h-21.5 w-full cursor-pointer items-center justify-between gap-4 rounded bg-black px-6 max-sm:h-16 max-sm:px-4"
            >
                <div className="flex items-center gap-3">
                    <MoviesIcon className="max-sm:h-5 max-sm:w-5" />
                    <p className="text-2xl leading-normal font-normal text-white max-sm:text-lg">
                        {t('feed.chooseMovie')}
                    </p>
                </div>
                <ArrowDown size={24} />
            </button>
            {isOpen && (
                <div className="bg-profile-modal-bg border-modal-secondary-text absolute bottom-full left-8 z-10 mb-2.5 max-h-72 w-100 overflow-y-auto rounded-xl border max-sm:w-80">
                    <div className="border-modal-secondary-text flex items-center gap-4 border-b px-4 py-3">
                        <SearchIcon />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('feed.searchForMovie')}
                            className="text-input-bg placeholder:text-input-bg flex-1 border-none bg-transparent text-xl leading-normal font-normal tracking-normal outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    {isLoading && (
                        <p className="text-modal-secondary-text px-4 py-3 text-base leading-normal font-normal tracking-normal">
                            {t('feed.searching')}
                        </p>
                    )}
                    {!isLoading && results.length === 0 && (
                        <p className="text-modal-secondary-text px-4 py-3 text-base leading-normal font-normal tracking-normal">
                            {t('feed.noMoviesFound')}
                        </p>
                    )}
                    {!isLoading &&
                        results.map((movie) => (
                            <button
                                key={movie.id}
                                type="button"
                                onClick={() => {
                                    onSelect(movie);
                                    setIsOpen(false);
                                }}
                                className="flex w-full min-w-0 cursor-pointer items-center gap-4 px-4 py-3 text-left hover:bg-white/5"
                            >
                                <div className="bg-input-bg h-13 w-13 shrink-0 overflow-hidden rounded-lg max-sm:h-10 max-sm:w-10">
                                    {movie.poster_url && (
                                        <img
                                            src={movie.poster_url}
                                            alt={translate(movie.title)}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>
                                <p className="truncate text-xl leading-normal font-normal text-white max-sm:text-base">
                                    {translate(movie.title)} ({movie.release_year})
                                </p>
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}
