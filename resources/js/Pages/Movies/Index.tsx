import Button from '@/Components/Shared/Button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PlusIcon from '@/Components/Shared/Icons/PlusIcon';
import { cn } from '@/lib/cn';
import AddMovieModal from '@/Pages/Movies/Partials/Movie/AddMovieModal';
import MovieCard from '@/Pages/Movies/Partials/Movie/MovieCard';
import MovieSearch from '@/Pages/Movies/Partials/Movie/MovieSearch';
import SearchModal from '@/Components/Shared/SearchModal';
import { Movie, Paginated } from '@/types';
import { InfiniteScroll, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Index({
    movies,
    moviesCount,
    search: initialSearch,
}: {
    movies: Paginated<Movie>;
    moviesCount: number;
    search: string;
}) {
    const { t, i18n } = useTranslation();
    const [showAddMovieModal, setShowAddMovieModal] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route('movies.index'), search ? { filter: { search } } : {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <AuthenticatedLayout
            onOpenSearch={() => setIsSearchModalOpen(true)}
            searchButtonClassName="hidden cursor-pointer max-lg:mr-4 max-lg:flex"
            contentShrink0={false}
        >
            <div className="w-full lg:pl-8">
                <div className="flex flex-col">
                    <div className="lg:max-movies-compact:flex-col lg:max-movies-compact:items-stretch lg:max-movies-compact:gap-4 flex items-center justify-between gap-8">
                        <p className="min-w-0 truncate text-2xl leading-normal font-medium tracking-normal text-white max-sm:mt-5">
                            {t('movies.myList')}{' '}
                            <span className="max-sm:hidden">
                                {t('movies.myListCount', { count: moviesCount })}
                            </span>
                        </p>
                        <div className="lg:max-movies-compact:w-full lg:max-movies-compact:flex-none lg:max-movies-compact:flex-col lg:max-movies-compact:items-stretch lg:max-movies-compact:gap-4 flex min-w-0 flex-1 items-center justify-end gap-8 max-lg:flex-none">
                            <MovieSearch search={search} onSearchChange={setSearch} />
                            <Button
                                variant="danger-cta"
                                onClick={() => setShowAddMovieModal(true)}
                                className={cn(
                                    'lg:max-movies-compact:mt-4 h-12 w-38.5! shrink-0 leading-normal font-normal tracking-normal max-sm:mt-5 max-sm:h-9.5 max-sm:w-31.5! max-sm:text-base',
                                    i18n.language === 'ka' ? 'text-base' : 'text-xl',
                                )}
                            >
                                <PlusIcon />
                                {t('movies.addMovie')}
                            </Button>
                        </div>
                    </div>
                    <p className="hidden text-2xl leading-normal font-medium tracking-normal text-white max-sm:mt-2 max-sm:block max-sm:text-base">
                        {t('movies.myListCount', { count: moviesCount })}
                    </p>
                </div>
                <InfiniteScroll
                    data="movies"
                    className="grid-cols-movies mt-16 grid gap-15 max-sm:mt-8"
                    next={({ hasNext }) =>
                        !hasNext && (
                            <p className="text-modal-secondary-text py-6 text-center text-base leading-normal font-normal tracking-normal">
                                {search !== '' && movies.data.length === 0
                                    ? t('movies.noResults')
                                    : t('movies.noMoreMovies')}
                            </p>
                        )
                    }
                >
                    {movies.data.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </InfiniteScroll>
            </div>

            <SearchModal
                show={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                search={search}
                onSearchChange={setSearch}
            />

            <AddMovieModal show={showAddMovieModal} onClose={() => setShowAddMovieModal(false)} />
        </AuthenticatedLayout>
    );
}
