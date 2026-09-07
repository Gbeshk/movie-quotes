import { useFieldStatus } from '@/hooks/useFieldStatus';
import { cn } from '@/lib/cn';

export default function MovieTextarea({
    id,
    name,
    placeholder,
    value,
    onChange,
    error,
    validate,
    badge,
    className = 'mt-6',
}: {
    id: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    badge?: string;
    className?: string;
}) {
    const { status, errorMessage, markTouched } = useFieldStatus(value, error, validate);

    return (
        <div className={cn('relative w-full self-start px-8', className)}>
            <div
                className={cn(
                    'border-modal-secondary-text focus-within:border-modal-secondary-text w-full rounded border bg-transparent pt-2 pr-1 pb-1 pl-4',
                    status === 'error' && 'border-danger focus-within:border-danger',
                )}
            >
                <textarea
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={markTouched}
                    className={cn(
                        'm-0 h-21 w-full resize-y appearance-none border-0 bg-transparent p-0 text-xl leading-6 font-normal tracking-normal text-white outline-none placeholder:text-white',
                        badge && 'pr-12',
                        'focus:border-0 focus:shadow-none focus:ring-0',
                    )}
                />
            </div>
            {badge && (
                <span className="text-modal-secondary-text pointer-events-none absolute top-3 right-12 text-xl leading-6 font-normal tracking-normal">
                    {badge}
                </span>
            )}
            {status === 'error' && errorMessage && (
                <p className="text-error-text mt-1 text-sm leading-normal font-normal tracking-normal">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
