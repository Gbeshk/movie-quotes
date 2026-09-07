import { useFieldStatus } from '@/hooks/useFieldStatus';
import { cn } from '@/lib/cn';

export default function LabeledMovieField({
    id,
    name,
    label,
    inputMode,
    value,
    onChange,
    error,
    validate,
    badge,
    className,
}: {
    id: string;
    name: string;
    label: string;
    inputMode?: 'numeric';
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    badge?: string;
    className?: string;
}) {
    const { status, errorMessage, markTouched } = useFieldStatus(value, error, validate);

    return (
        <div className={cn('w-full self-start px-8', className)}>
            <div
                className={cn(
                    'border-modal-secondary-text focus-within:border-modal-secondary-text flex items-center gap-2 rounded border bg-transparent px-4 py-2',
                    status === 'error' && 'border-danger focus-within:border-danger',
                )}
            >
                <span className="text-modal-secondary-text shrink-0 text-xl leading-6 font-normal tracking-normal">
                    {label}
                </span>
                <input
                    type="text"
                    inputMode={inputMode}
                    id={id}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={markTouched}
                    className="m-0 min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-xl leading-6 font-normal tracking-normal text-white outline-none focus:border-0 focus:shadow-none focus:ring-0"
                />
                {badge && (
                    <span className="text-modal-secondary-text ml-auto shrink-0 text-xl leading-6 font-normal tracking-normal">
                        {badge}
                    </span>
                )}
            </div>
            {status === 'error' && errorMessage && (
                <p className="text-error-text mt-1 text-sm leading-normal font-normal tracking-normal">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
