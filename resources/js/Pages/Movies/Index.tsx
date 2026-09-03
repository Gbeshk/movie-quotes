import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Movie } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/Components/Shared/Button';
import MovieGrid from '@/Components/Shared/MovieGrid';
import AddMovieModal from './Partials/AddMovieModal';

export default function Index({ movies }: { movies: Movie[] }) {
    const [showAddMovie, setShowAddMovie] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl leading-tight font-semibold text-gray-800">
                        Your Movies
                    </h2>
                    <Button onClick={() => setShowAddMovie(true)}>Add Movie</Button>
                </div>
            }
        >
            <Head title="Your Movies" />

            <AddMovieModal show={showAddMovie} onClose={() => setShowAddMovie(false)} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <MovieGrid movies={movies} emptyMessage="You haven't added any movies yet." />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
