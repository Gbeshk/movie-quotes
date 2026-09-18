import EditIcon from '@/Components/Shared/Icons/EditIcon';
import TrashIcon from '@/Components/Shared/Icons/TrashIcon';
import { useTranslatable } from '@/utils/translatable';
import GenreTags from '@/Pages/Movies/Partials/Movie/GenreTags';
import MovieDirector from '@/Pages/Movies/Partials/Movie/MovieDirector';
import { Movie } from '@/types';

export default function MovieDetails({
    movie,
    isOwner,
    onEdit,
    onDelete,
}: {
    movie: Movie;
    isOwner: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const translate = useTranslatable();

    return (
        <div className="mt-8 flex w-full gap-3">
            <div className="bg-input-bg h-110 w-3/5 overflow-hidden rounded-xl">
                {movie.poster_url && (
                    <img
                        src={movie.poster_url}
                        alt={translate(movie.title)}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>
            <div className="w-2/5">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-logo-text flex min-w-0 items-baseline gap-1 text-2xl font-medium">
                        <span className="truncate">{translate(movie.title)}</span>
                        <span className="shrink-0">({movie.release_year})</span>
                    </p>
                    {isOwner && (
                        <div className="bg-header-bg flex h-10 w-36 shrink-0 items-center justify-evenly rounded-xl">
                            <button
                                type="button"
                                onClick={onEdit}
                                className="flex items-center justify-center border-0 bg-transparent p-0"
                            >
                                <EditIcon />
                            </button>
                            <div className="bg-modal-secondary-text h-4 w-px"></div>
                            <button
                                type="button"
                                onClick={onDelete}
                                className="flex items-center justify-center border-0 bg-transparent p-0"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    <GenreTags genres={movie.genre} />
                </div>
                <div className="mt-2.5">
                    <MovieDirector director={translate(movie.director)} />
                </div>
                <div className="text-input-bg mt-5 text-lg font-normal">
                    {translate(movie.description)}
                </div>
            </div>
        </div>
    );
}
