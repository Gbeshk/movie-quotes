import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Movie } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/Components/Shared/Button';
import AddMovieModal from './Partials/AddMovieModal';

export default function Index({ movies }: { movies: Movie[] }) {
    const [showAddMovie, setShowAddMovie] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl leading-tight font-semibold text-gray-800">My Movies</h2>
                    <Button onClick={() => setShowAddMovie(true)}>Add Movie</Button>
                </div>
            }
        >
            <Head title="My Movies" />

            <AddMovieModal show={showAddMovie} onClose={() => setShowAddMovie(false)} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {movies.length === 0 ? (
                        <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                            You haven&apos;t added any movies yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {movies.map((movie) => (
                                <Link
                                    key={movie.id}
                                    href={route('movies.show', movie.id)}
                                    className="block overflow-hidden rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {movie.title.en}
                                    </h3>
                                    <p className="text-sm text-gray-500">{movie.release_year}</p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        {movie.quotes_count ?? 0} quotes
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
