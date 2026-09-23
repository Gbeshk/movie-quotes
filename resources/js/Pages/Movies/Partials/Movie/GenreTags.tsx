import { cn } from '@/lib/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DEFAULT_VISIBLE_GENRES_COUNT = 3;

export default function GenreTags({
    genres,
    compact = false,
    maxVisible = DEFAULT_VISIBLE_GENRES_COUNT,
}: {
    genres: string[];
    compact?: boolean;
    maxVisible?: number;
}) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const hasOverflow = genres.length > maxVisible;
    const visibleGenres = expanded || !hasOverflow ? genres : genres.slice(0, maxVisible);

    return (
        <div className={cn('flex items-center gap-2', expanded && 'flex-wrap')}>
            {visibleGenres.map((genre) => (
                <div
                    key={genre}
                    className={cn(
                        'bg-modal-secondary-text shrink-0 rounded text-center align-middle leading-none font-bold wrap-break-word text-white',
                        compact ? 'max-w-25 px-2 py-1 text-sm' : 'max-w-50 px-3 py-1.5 text-lg',
                    )}
                >
                    {genre}
                </div>
            ))}
            {hasOverflow && (
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className={cn(
                        'text-modal-secondary-text shrink-0 cursor-pointer font-bold underline',
                        compact ? 'text-sm' : 'text-lg leading-none',
                    )}
                >
                    {expanded ? t('movies.showLessGenres') : `+${genres.length - maxVisible}`}
                </button>
            )}
        </div>
    );
}
