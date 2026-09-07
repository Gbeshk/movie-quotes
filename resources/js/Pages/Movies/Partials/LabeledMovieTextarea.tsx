import { useFieldStatus } from '@/hooks/useFieldStatus';
import { cn } from '@/lib/cn';

export default function LabeledMovieTextarea({
    id,
    name,
    label,
    value,
    onChange,
    error,
    validate,
    badge,
}: {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    badge?: string;
}) {
    const { status, errorMessage, markTouched } = useFieldStatus(value, error, validate);

    return (
        <div className="mt-6 w-full self-start px-8">
            <div
                className={cn(
                    'border-modal-secondary-text focus-within:border-modal-secondary-text relative flex w-full items-start gap-2 rounded border bg-transparent pt-2 pr-1 pb-1 pl-4',
                    status === 'error' && 'border-danger focus-within:border-danger',
                )}
            >
                <span className="text-modal-secondary-text shrink-0 text-xl leading-6 font-normal tracking-normal">
                    {label}
                </span>
                <textarea
                    id={id}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={markTouched}
                    className={cn(
                        'm-0 h-21 min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-xl leading-6 font-normal tracking-normal text-white outline-none focus:border-0 focus:shadow-none focus:ring-0',
                        badge && 'pr-12',
                    )}
                />
                {badge && (
                    <span className="text-modal-secondary-text pointer-events-none absolute top-2.25 right-4 text-xl leading-6 font-normal tracking-normal">
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
