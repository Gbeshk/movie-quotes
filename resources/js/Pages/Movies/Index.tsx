import Button from '@/Components/Shared/Button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchIcon from '@/Components/Shared/Icons/SearchIcon';
import AddMovieBtn from '@/Components/Shared/Icons/AddMovieBtn';
import AddMovieModal from '@/Pages/Movies/Partials/AddMovieModal';
import MovieCard from '@/Pages/Movies/Partials/MovieCard';
import { Movie, Paginated } from '@/types';
import { InfiniteScroll } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    movies,
    moviesCount,
}: {
    movies: Paginated<Movie>;
    moviesCount: number;
}) {
    const [showAddMovieModal, setShowAddMovieModal] = useState(false);

    return (
        <AuthenticatedLayout>
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <p className="text-2xl leading-normal font-medium tracking-normal text-white">
                        My list of movies (Total {moviesCount})
                    </p>
                    <div>
                        <div className="flex items-center gap-8">
                            <div className="flex cursor-pointer items-center gap-4">
                                <SearchIcon />
                                <p className="text-input-bg text-xl leading-normal font-normal tracking-normal">
                                    Search
                                </p>
                            </div>
                            <Button
                                variant="danger-cta"
                                onClick={() => setShowAddMovieModal(true)}
                                className="h-12 w-38.5! text-xl leading-normal font-normal tracking-normal"
                            >
                                <AddMovieBtn />
                                Add movie
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
