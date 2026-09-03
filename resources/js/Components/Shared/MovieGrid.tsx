import { Movie } from '@/types';
import { Link } from '@inertiajs/react';

export default function MovieGrid({
    movies,
    emptyMessage,
    showAuthor = false,
}: {
    movies: Movie[];
    emptyMessage: string;
    showAuthor?: boolean;
}) {
    if (movies.length === 0) {
        return (
            <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
                <Link
                    key={movie.id}
                    href={route('movies.show', movie.id)}
                    className="block overflow-hidden rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold text-gray-900">{movie.title.en}</h3>
                    <p className="text-sm text-gray-500">{movie.release_year}</p>
                    <p className="mt-2 text-sm text-gray-600">{movie.quotes_count ?? 0} quotes</p>
                    {showAuthor && movie.user && (
                        <p className="mt-2 text-sm text-gray-400">Added by {movie.user.username}</p>
                    )}
                </Link>
            ))}
        </div>
    );
}
