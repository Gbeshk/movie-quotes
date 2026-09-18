import QuotesIcon from '@/Components/Shared/Icons/QuotesIcon';
import { useTranslatable } from '@/utils/translatable';
import { Movie } from '@/types';
import { Link } from '@inertiajs/react';

export default function MovieCard({ movie }: { movie: Movie }) {
    const translate = useTranslatable();

    return (
        <Link
            href={route('movies.show', movie.id)}
            className="flex h-117.75 w-full flex-col overflow-hidden rounded-xl"
        >
            <div className="bg-input-bg h-92 w-full overflow-hidden rounded-b-xl">
                {movie.poster_url && (
                    <img
                        src={movie.poster_url}
                        alt={translate(movie.title)}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="mt-4 flex flex-1 flex-col justify-center gap-2">
                <p className="flex min-w-0 items-baseline gap-1 text-2xl leading-normal font-medium tracking-normal text-white uppercase">
                    <span className="truncate">{translate(movie.title)}</span>
                    <span className="shrink-0">({movie.release_year})</span>
                </p>
                <p className="flex items-center gap-3 text-xl leading-normal font-medium tracking-normal text-white">
                    {movie.quotes_count ?? 0} <QuotesIcon />
                </p>
            </div>
        </Link>
    );
}
