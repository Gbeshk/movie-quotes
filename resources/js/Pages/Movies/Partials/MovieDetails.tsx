import EditIcon from '@/Components/Shared/Icons/EditIcon';
import TrashIcon from '@/Components/Shared/Icons/TrashIcon';
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
            <div className="bg-input-bg h-110 w-full overflow-hidden rounded-xl">
                {movie.poster_url && (
                    <img
                        src={movie.poster_url}
                        alt={movie.title.en}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>
            <div className="w-2/3">
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
                <div className="mt-6 flex items-center gap-2">
                    {movie.genre.map((genre) => (
                        <div
                            key={genre}
                            className="bg-modal-secondary-text rounded px-3 py-1.5 text-center align-middle text-lg leading-none font-bold text-white"
                        >
                            {genre}
                        </div>
                    ))}
                </div>
                <div className="mt-2.5">
                    <p className="text-input-bg text-lg font-bold">
                        Director: <span className="text-white">{movie.director.en}</span>
                    </p>
                </div>
                <div className="text-input-bg mt-5 text-lg font-normal">{movie.description.en}</div>
            </div>
        </div>
    );
}
