import DeleteTagIcon from '@/Components/Shared/Icons/DeleteTagIcon';
import { isEnglishText } from '@/lib/validators';
import { KeyboardEvent, useState } from 'react';

export default function GenreInput({
    genres,
    onChange,
    error,
}: {
    genres: string[];
    onChange: (genres: string[]) => void;
    error?: string;
}) {
    const [text, setText] = useState('');
    const [localError, setLocalError] = useState<string>();

    const addGenre = () => {
        const trimmed = text.trim();

        if (!trimmed) {
            return;
        }

        if (!isEnglishText(trimmed)) {
            setLocalError('Genre must contain only English characters.');
            return;
        }

        if (!genres.includes(trimmed)) {
            onChange([...genres, trimmed]);
        }

        setLocalError(undefined);
        setText('');
    };

    const removeGenre = (genre: string) => {
        onChange(genres.filter((existing) => existing !== genre));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addGenre();
        }
    };

    return (
        <div className="mt-6 w-full self-start px-8">
            <div className="border-modal-secondary-text focus-within:border-modal-secondary-text flex w-full flex-wrap items-center gap-1 rounded border bg-transparent px-4 py-2">
                {genres.map((genre) => (
                    <div
                        key={genre}
                        className="bg-modal-secondary-text flex shrink-0 items-center gap-1 rounded-xs px-1.5 py-0.5"
                    >
                        <span className="text-xl leading-6 font-normal tracking-normal text-white">
                            {genre}
                        </span>
                        <button type="button" onClick={() => removeGenre(genre)}>
                            <DeleteTagIcon />
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        setLocalError(undefined);
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={addGenre}
                    placeholder={genres.length === 0 ? 'Genre/ჟანრი' : undefined}
                    className="m-0 min-w-24 flex-1 appearance-none border-0 bg-transparent p-0 text-xl leading-6 font-normal tracking-normal text-white outline-none placeholder:text-white focus:border-0 focus:shadow-none focus:ring-0"
                />
            </div>
            {(localError ?? error) && (
                <p className="text-error-text mt-1 text-sm leading-normal font-normal tracking-normal">
                    {localError ?? error}
                </p>
            )}
        </div>
    );
}
