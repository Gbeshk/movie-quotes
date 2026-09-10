import EditIcon from '@/Components/Shared/Icons/EditIcon';
import TrashIcon from '@/Components/Shared/Icons/TrashIcon';
import GenreTags from '@/Pages/Movies/Partials/GenreTags';
import MovieDirector from '@/Pages/Movies/Partials/MovieDirector';
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
    return (
        <div className="mt-8 flex w-full gap-3">
            <div className="bg-input-bg h-110 w-3/5 overflow-hidden rounded-xl">
                {movie.poster_url && (
                    <img
                        src={movie.poster_url}
                        alt={movie.title.en}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>
            <div className="w-2/5">
                <div className="flex items-center justify-between">
                    <p className="text-logo-text text-2xl font-medium">
                        {movie.title.en} ({movie.release_year})
                    </p>
                    {isOwner && (
                        <div className="bg-header-bg flex h-10 w-36 items-center justify-evenly rounded-xl">
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
                    <MovieDirector director={movie.director.en} />
                </div>
                <div className="text-input-bg mt-5 text-lg font-normal">{movie.description.en}</div>
            </div>
        </div>
    );
}
