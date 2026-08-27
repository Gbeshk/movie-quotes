import ClearIcon from '@/Components/Shared/Icons/ClearIcon';
import ErrorIcon from '@/Components/Shared/Icons/ErrorIcon';
import EyeIcon from '@/Components/Shared/Icons/EyeIcon';
import SuccessIcon from '@/Components/Shared/Icons/SuccessIcon';
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
}: {
    label: string;
    id: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => boolean;
    autoComplete?: string;
    required?: boolean;
}) {
    const [visible, setVisible] = useState(false);
    const [focused, setFocused] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && visible ? 'text' : type;
    const isValid = validate ? validate(value) : value.trim().length > 0;
    // Once the server has flagged an error, valid input should switch to success
    // immediately (even while still focused) instead of waiting for a blur/resubmit.
    const showSuccess = isValid && (!focused || Boolean(error));
    const showClear = focused && value.length > 0 && !showSuccess;
    const status = error && !isValid ? 'error' : showSuccess ? 'success' : 'default';
    const hasIcons = status !== 'default' || isPassword || showClear;

    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="text-base leading-normal font-normal tracking-normal text-white"
            >
                {label}
            </label>

            <div className="relative mt-2">
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
                    onBlur={() => setFocused(false)}
                    className={cn(
                        'bg-input-bg text-input-text h-9.5 w-full rounded border px-3 placeholder:text-base placeholder:leading-normal placeholder:font-normal placeholder:tracking-normal focus:shadow-[0_0_0_4px_#0D6EFD40] focus:ring-0 focus:outline-none',
                        status === 'error'
                            ? 'border-danger'
                            : status === 'success'
                              ? 'border-success'
                              : 'border-transparent',
                        hasIcons && 'pr-16',
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
                    {error}
                </p>
            )}
        </div>
    );
}
