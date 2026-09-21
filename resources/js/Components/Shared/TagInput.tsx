import DeleteTagIcon from '@/Components/Shared/Icons/DeleteTagIcon';
import { KeyboardEvent, useState } from 'react';

export default function TagInput({
    tags,
    onChange,
    error,
    validate,
    placeholder,
    maxLength,
}: {
    tags: string[];
    onChange: (tags: string[]) => void;
    error?: string;
    validate?: (value: string) => true | string;
    placeholder?: string;
    maxLength?: number;
}) {
    const [text, setText] = useState('');
    const [localError, setLocalError] = useState<string>();

    const addTag = () => {
        const trimmed = text.trim();

        if (!trimmed) {
            return;
        }

        const validationResult = validate ? validate(trimmed) : true;

        if (validationResult !== true) {
            setLocalError(validationResult);
            return;
        }

        if (!tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }

        setLocalError(undefined);
        setText('');
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((existing) => existing !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="mt-6 w-full self-start px-8">
            <div className="border-modal-secondary-text focus-within:border-modal-secondary-text flex w-full flex-wrap items-center gap-1 rounded border bg-transparent px-4 py-2">
                {tags.map((tag) => (
                    <div
                        key={tag}
                        className="bg-modal-secondary-text flex shrink-0 items-center gap-1 rounded-xs px-1.5 py-0.5"
                    >
                        <span className="max-w-50 text-xl leading-6 font-normal tracking-normal wrap-break-word text-white max-sm:text-base">
                            {tag}
                        </span>
                        <button type="button" onClick={() => removeTag(tag)}>
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
                    onBlur={addTag}
                    placeholder={tags.length === 0 ? placeholder : undefined}
                    maxLength={maxLength}
                    className="m-0 min-w-24 flex-1 appearance-none border-0 bg-transparent p-0 text-xl leading-6 font-normal tracking-normal text-white outline-none placeholder:text-white focus:border-0 focus:shadow-none focus:ring-0 max-sm:text-base"
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
