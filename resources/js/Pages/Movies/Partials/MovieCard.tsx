import QuotesIcon from '@/Components/Shared/Icons/QuotesIcon';
import { Movie } from '@/types';
import { Link } from '@inertiajs/react';

export default function MovieCard({ movie }: { movie: Movie }) {
    return (
        <Link
            href={route('movies.show', movie.id)}
            className="flex h-117.75 w-full flex-col overflow-hidden rounded-xl"
        >
            <div className="bg-input-bg h-110 w-full overflow-hidden rounded-b-xl">
                {movie.poster_url && (
                    <img
                        src={movie.poster_url}
                        alt={movie.title.en}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="mt-4 flex flex-1 flex-col justify-center gap-2">
                <p className="text-2xl leading-normal font-medium tracking-normal text-white uppercase">
                    {movie.title.en} ({movie.release_year})
                </p>
                <p className="flex items-center gap-3 text-xl leading-normal font-medium tracking-normal text-white">
                    {movie.quotes_count ?? 0} <QuotesIcon />
                </p>
            </div>
        </Link>
    );
}
