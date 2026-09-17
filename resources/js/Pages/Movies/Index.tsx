import Button from '@/Components/Shared/Button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PlusIcon from '@/Components/Shared/Icons/PlusIcon';
import { cn } from '@/lib/cn';
import AddMovieModal from '@/Pages/Movies/Partials/Movie/AddMovieModal';
import MovieCard from '@/Pages/Movies/Partials/Movie/MovieCard';
import MovieSearch from '@/Pages/Movies/Partials/Movie/MovieSearch';
import { Movie, Paginated } from '@/types';
import { InfiniteScroll } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Index({
    movies,
    moviesCount,
    search,
}: {
    movies: Paginated<Movie>;
    moviesCount: number;
    search: string;
}) {
    const { t, i18n } = useTranslation();
    const [showAddMovieModal, setShowAddMovieModal] = useState(false);

    return (
        <AuthenticatedLayout>
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <p className="text-2xl leading-normal font-medium tracking-normal text-white">
                        {t('movies.myList', { count: moviesCount })}
                    </p>
                    <div>
                        <div className="flex items-center gap-8">
                            <MovieSearch initialSearch={search} />
                            <Button
                                variant="danger-cta"
                                onClick={() => setShowAddMovieModal(true)}
                                className={cn(
                                    'h-12 w-38.5! leading-normal font-normal tracking-normal',
                                    i18n.language === 'ka' ? 'text-base' : 'text-xl',
                                )}
                            >
                                <PlusIcon />
                                {t('movies.addMovie')}
                            </Button>
                        </div>
                    </div>
                </div>
                <InfiniteScroll data="movies" className="mt-16 grid grid-cols-3 gap-15">
                    {movies.data.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </InfiniteScroll>
            </div>

            <AddMovieModal show={showAddMovieModal} onClose={() => setShowAddMovieModal(false)} />
        </AuthenticatedLayout>
    );
}
