import ArrowDown from '@/Components/Shared/Icons/ArrowDown';
import MoviesIcon from '@/Components/Shared/Icons/MoviesIcon';
import SearchIcon from '@/Components/Shared/Icons/SearchIcon';
import { Movie } from '@/types';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function MoviePicker({
    onSelect,
    autoOpen = false,
}: {
    onSelect: (movie: Movie) => void;
    autoOpen?: boolean;
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [isOpen, setIsOpen] = useState(autoOpen);
    const [isLoading, setIsLoading] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            setIsLoading(true);

            fetch(route('movies.search', { q: query }), {
                headers: { Accept: 'application/json' },
                signal: controller.signal,
            })
                .then((response) => response.json())
                .then((movies: Movie[]) => setResults(movies))
                .catch(() => {})
                .finally(() => setIsLoading(false));
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                !menuRef.current?.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useLayoutEffect(() => {
        if (!isOpen || !triggerRef.current) {
            return;
        }

        const MENU_HEIGHT = 288;

        const updatePosition = () => {
            const rect = triggerRef.current!.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUpward = spaceBelow < MENU_HEIGHT + 8 && rect.top > MENU_HEIGHT + 8;

            setMenuPosition({
                top: openUpward ? rect.top - MENU_HEIGHT - 8 : rect.bottom + 8,
                left: rect.left,
            });
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative mt-6 w-full px-8">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="flex h-21.5 w-full cursor-pointer items-center justify-between gap-4 rounded bg-black px-6"
            >
                <div className="flex items-center gap-3">
                    <MoviesIcon />
                    <p className="text-2xl leading-normal font-normal text-white">Choose movie</p>
                </div>
                <ArrowDown size={24} />
            </button>
            {isOpen &&
                menuPosition &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{ top: menuPosition.top, left: menuPosition.left }}
                        className="bg-profile-modal-bg border-modal-secondary-text fixed z-60 max-h-72 w-100 overflow-y-auto rounded-xl border"
                    >
                        <div className="border-modal-secondary-text flex items-center gap-4 border-b px-4 py-3">
                            <SearchIcon />
                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for a movie"
                                className="text-input-bg placeholder:text-input-bg flex-1 border-none bg-transparent text-xl leading-normal font-normal tracking-normal outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        {isLoading && (
                            <p className="text-modal-secondary-text px-4 py-3 text-base leading-normal font-normal tracking-normal">
                                Searching…
                            </p>
                        )}
                        {!isLoading && results.length === 0 && (
                            <p className="text-modal-secondary-text px-4 py-3 text-base leading-normal font-normal tracking-normal">
                                No movies found
                            </p>
                        )}
                        {!isLoading &&
                            results.map((movie) => (
                                <button
                                    key={movie.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(movie);
                                        setIsOpen(false);
                                    }}
                                    className="flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-left hover:bg-white/5"
                                >
                                    <div className="bg-input-bg h-13 w-13 shrink-0 overflow-hidden rounded-lg">
                                        {movie.poster_url && (
                                            <img
                                                src={movie.poster_url}
                                                alt={movie.title.en}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <p className="text-xl leading-normal font-normal text-white">
                                        {movie.title.en} ({movie.release_year})
                                    </p>
                                </button>
                            ))}
                    </div>,
                    document.body,
                )}
        </div>
    );
}
