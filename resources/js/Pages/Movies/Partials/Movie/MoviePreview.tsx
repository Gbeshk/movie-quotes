import ClampText from '@/Components/Shared/ClampText';
import { cn } from '@/lib/cn';
import { useTranslatable } from '@/lib/translatable';
import GenreTags from '@/Pages/Movies/Partials/Movie/GenreTags';
import MovieDirector from '@/Pages/Movies/Partials/Movie/MovieDirector';
import { Movie } from '@/types';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MoviePreview({
    movie,
    className = 'mt-7.5',
    action,
}: {
    movie: Movie;
    className?: string;
    action?: ReactNode;
}) {
    const { t } = useTranslation();
    const translate = useTranslatable();
    const [detailsExpanded, setDetailsExpanded] = useState(false);
    const toggleDetails = () => setDetailsExpanded((prev) => !prev);

    const [isDesktopTitleClamped, setIsDesktopTitleClamped] = useState(false);
    const [isDesktopDirectorClamped, setIsDesktopDirectorClamped] = useState(false);
    const desktopDetailsOverflow =
        isDesktopTitleClamped || isDesktopDirectorClamped || detailsExpanded;

    const [isMobileTitleClamped, setIsMobileTitleClamped] = useState(false);
    const [isMobileDirectorClamped, setIsMobileDirectorClamped] = useState(false);
    const mobileDetailsOverflow =
        isMobileTitleClamped || isMobileDirectorClamped || detailsExpanded;

    return (
        <div className={cn('w-full', className)}>
            <div className="hidden min-h-40 w-full items-center gap-6 px-8 sm:flex">
                <div className="bg-input-bg h-40 w-72.5 shrink-0 overflow-hidden rounded-xl">
                    {movie.poster_url && (
                        <img
                            src={movie.poster_url}
                            alt={translate(movie.title)}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                    <ClampText
                        axis="width"
                        expanded={detailsExpanded}
                        onClampChange={setIsDesktopTitleClamped}
                        className="text-logo-text text-2xl leading-relaxed font-medium tracking-normal wrap-break-word"
                    >
                        {translate(movie.title)} ({movie.release_year})
                    </ClampText>

                    <GenreTags genres={movie.genre} />

                    <div>
                        <MovieDirector
                            director={translate(movie.director)}
                            expanded={detailsExpanded}
                            onClampChange={setIsDesktopDirectorClamped}
                        />
                        {desktopDetailsOverflow && (
                            <button
                                type="button"
                                onClick={toggleDetails}
                                className="text-modal-secondary-text mt-1 w-fit cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline"
                            >
                                {detailsExpanded
                                    ? t('movies.showLessDetails')
                                    : t('movies.showMoreDetails')}
                            </button>
                        )}
                    </div>
                </div>
                {action}
            </div>

            <div className="px-8 sm:hidden">
                <div className="flex min-h-28.5 w-full items-center gap-6 rounded bg-black px-2 py-4">
                    <div className="bg-input-bg w-movie-preview-poster h-20 shrink-0 overflow-hidden rounded-xl">
                        {movie.poster_url && (
                            <img
                                src={movie.poster_url}
                                alt={translate(movie.title)}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <ClampText
                            axis="width"
                            expanded={detailsExpanded}
                            onClampChange={setIsMobileTitleClamped}
                            className="text-logo-text text-lg leading-normal font-medium tracking-normal wrap-break-word"
                        >
                            {translate(movie.title)} ({movie.release_year})
                        </ClampText>
                        <ClampText
                            axis="width"
                            expanded={detailsExpanded}
                            onClampChange={setIsMobileDirectorClamped}
                            className="text-input-bg text-base leading-normal font-bold wrap-break-word"
                        >
                            {t('movies.director')}{' '}
                            <span className="font-normal text-white">
                                {translate(movie.director)}
                            </span>
                        </ClampText>
                        {mobileDetailsOverflow && (
                            <button
                                type="button"
                                onClick={toggleDetails}
                                className="text-modal-secondary-text w-fit cursor-pointer text-sm leading-normal font-normal tracking-normal hover:underline"
                            >
                                {detailsExpanded
                                    ? t('movies.showLessDetails')
                                    : t('movies.showMoreDetails')}
                            </button>
                        )}
                        <GenreTags genres={movie.genre} compact maxVisible={2} />
                    </div>
                    {action}
                </div>
            </div>
        </div>
    );
}
