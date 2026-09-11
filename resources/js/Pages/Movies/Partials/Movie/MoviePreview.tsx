import GenreTags from '@/Pages/Movies/Partials/Movie/GenreTags';
import MovieDirector from '@/Pages/Movies/Partials/Movie/MovieDirector';
import { cn } from '@/lib/cn';
import { Movie } from '@/types';
import { ReactNode } from 'react';

export default function MoviePreview({
    movie,
    className = 'mt-7.5',
    action,
}: {
    movie: Movie;
    className?: string;
    action?: ReactNode;
}) {
    return (
        <div className={cn('flex h-40 w-full items-center gap-6 px-8', className)}>
            <div className="bg-input-bg h-full w-72.5 shrink-0 overflow-hidden rounded-xl">
                {movie.poster_url && (
                    <img
                        src={movie.poster_url}
                        alt={movie.title.en}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>
            <div className="flex flex-col justify-between gap-5">
                <p className="text-logo-text text-2xl leading-relaxed font-medium tracking-normal">
                    {movie.title.en} ({movie.release_year})
                </p>

                <GenreTags genres={movie.genre} />
                <MovieDirector director={movie.director.en} />
            </div>
            {action}
        </div>
    );
}
