import { useFieldStatus } from '@/hooks/useFieldStatus';
import { cn } from '@/lib/cn';

export default function MovieField({
    id,
    name,
    type = 'text',
    inputMode,
    placeholder,
    value,
    onChange,
    error,
    validate,
    badge,
    className,
}: {
    id: string;
    name: string;
    type?: 'text';
    inputMode?: 'numeric';
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
            <input
                type={type}
                inputMode={inputMode}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={markTouched}
                className={cn(
                    'border-modal-secondary-text focus:border-modal-secondary-text w-full rounded border bg-transparent py-2 pl-4 text-xl leading-6 font-normal tracking-normal text-white outline-none placeholder:text-white',
                    badge ? 'pr-16' : 'pr-4',
                    status === 'error' && 'border-danger focus:border-danger',
                    'focus:shadow-none focus:ring-0',
                )}
            />
            {badge && (
                <span className="text-modal-secondary-text pointer-events-none absolute top-2.25 right-12 text-xl leading-6 font-normal tracking-normal">
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
