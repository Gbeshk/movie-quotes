import ClearIcon from '@/Components/Shared/Icons/ClearIcon';
import ErrorIcon from '@/Components/Shared/Icons/ErrorIcon';
import EyeIcon from '@/Components/Shared/Icons/EyeIcon';
import SuccessIcon from '@/Components/Shared/Icons/SuccessIcon';
import { useFieldStatus } from '@/hooks/useFieldStatus';
import { cn } from '@/lib/cn';
import { useState } from 'react';

export default function FormField({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    validate,
    autoComplete,
    required,
    heightClassName = 'h-9.5',
    labelGapClassName = 'mt-2',
}: {
    label: string;
    id: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    autoComplete?: string;
    required?: boolean;
    heightClassName?: string;
    labelGapClassName?: string;
}) {
    const [visible, setVisible] = useState(false);
    const [focused, setFocused] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && visible ? 'text' : type;
    const { status, errorMessage, markTouched } = useFieldStatus(value, error, validate);
    const showClear = focused && value.length > 0;
    const hasIcons = status !== 'default' || isPassword || showClear;

    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="text-base leading-normal font-normal tracking-normal text-white"
            >
                {label}
                {status === 'error' && <span className="text-error-text"> *</span>}
            </label>

            <div className={cn('relative', labelGapClassName)}>
                <input
                    id={id}
                    name={id}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    autoComplete={autoComplete}
                    required={required}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setFocused(false);
                        markTouched();
                    }}
                    className={cn(
                        'bg-input-bg text-input-text w-full rounded border px-3 placeholder:text-base placeholder:leading-normal placeholder:font-normal placeholder:tracking-normal focus:shadow-[0_0_0_4px_#0D6EFD40] focus:ring-0 focus:outline-none',
                        heightClassName,
                        status === 'error'
                            ? 'border-danger'
                            : status === 'success'
                              ? 'border-success'
                              : 'border-transparent',
                        hasIcons && 'pr-20',
                    )}
                />

                <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                    {status === 'error' && <ErrorIcon />}
                    {status === 'success' && <SuccessIcon />}

                    {showClear && (
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => onChange('')}
                            className="flex items-center justify-center border-0 p-0 leading-none"
                        >
                            <ClearIcon />
                        </button>
                    )}

                    {isPassword && (
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setVisible((previous) => !previous)}
                            className="flex items-center justify-center border-0 p-0 leading-none"
                        >
                            <EyeIcon crossed={visible} />
                        </button>
                    )}
                </div>
            </div>

            {status === 'error' && (
                <p className="text-error-text mt-1 text-sm leading-normal font-normal tracking-normal">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
