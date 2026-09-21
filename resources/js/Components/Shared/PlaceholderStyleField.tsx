import Textarea from '@/Components/Shared/TextArea';
import { useFieldStatus } from '@/hooks/useFieldStatus';
import { cn } from '@/lib/cn';

export default function PlaceholderStyleField({
    as = 'input',
    id,
    name,
    inputMode,
    placeholder,
    value,
    onChange,
    error,
    validate,
    badge,
    className,
    textareaHeightClassName,
    maxLength,
}: {
    as?: 'input' | 'textarea';
    id: string;
    name: string;
    inputMode?: 'numeric';
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    badge?: string;
    className?: string;
    textareaHeightClassName?: string;
    maxLength?: number;
}) {
    const { status, errorMessage, markTouched } = useFieldStatus(value, error, validate);

    if (as === 'textarea') {
        return (
            <div className={cn('relative w-full self-start px-8', className ?? 'mt-6')}>
                <div
                    className={cn(
                        'border-modal-secondary-text focus-within:border-modal-secondary-text w-full rounded border bg-transparent pt-2 pr-1 pb-1 pl-4',
                        status === 'error' && 'border-danger focus-within:border-danger',
                    )}
                >
                    <Textarea
                        id={id}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={markTouched}
                        className={cn('w-full placeholder:text-white', badge && 'pr-12')}
                        heightClassName={textareaHeightClassName}
                        maxLength={maxLength}
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

    return (
        <div className={cn('relative w-full self-start px-8', className)}>
            <input
                type="text"
                inputMode={inputMode}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={markTouched}
                maxLength={maxLength}
                className={cn(
                    'border-modal-secondary-text focus:border-modal-secondary-text w-full rounded border bg-transparent py-2 pl-4 text-xl leading-6 font-normal tracking-normal text-white outline-none placeholder:text-white max-sm:text-base',
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
