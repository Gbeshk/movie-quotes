import QuotesIcon from '@/Components/Shared/Icons/QuotesIcon';
import { useTranslatable } from '@/lib/translatable';
import { Movie } from '@/types';
import { Link } from '@inertiajs/react';

export default function MovieCard({ movie }: { movie: Movie }) {
    const translate = useTranslatable();

    return (
        <Link
            href={route('movies.show', movie.id)}
            className="flex h-117.75 w-full flex-col overflow-hidden rounded-xl max-sm:h-100"
        >
            <div className="bg-input-bg h-92 w-full overflow-hidden rounded-b-xl max-sm:h-75">
                {movie.poster_url && (
                    <img
                        src={movie.poster_url}
                        alt={translate(movie.title)}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="mt-4 flex flex-1 flex-col justify-center gap-2 max-sm:mt-2">
                <p className="flex min-w-0 items-baseline gap-1 text-2xl leading-normal font-medium tracking-normal text-white uppercase">
                    <span className="truncate">{translate(movie.title)}</span>
                    <span className="shrink-0">({movie.release_year})</span>
                </p>
                <p className="flex items-center gap-3 text-xl leading-normal font-medium tracking-normal text-white">
                    {movie.quotes_count ?? 0} <QuotesIcon className="max-sm:h-6 max-sm:w-6" />
                </p>
            </div>
        </Link>
    );
}
