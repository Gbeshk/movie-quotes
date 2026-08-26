import ClearIcon from '@/Components/Shared/Icons/ClearIcon';
import ErrorIcon from '@/Components/Shared/Icons/ErrorIcon';
import EyeIcon from '@/Components/Shared/Icons/EyeIcon';
import SuccessIcon from '@/Components/Shared/Icons/SuccessIcon';
import { cn } from '@/lib/cn';
import { ReactNode, useState } from 'react';

const ICON_POSITIONS = ['right-3', 'right-8', 'right-13'];
const INPUT_PADDING_BY_ICON_COUNT = ['', 'pr-9', 'pr-14', 'pr-19'];

export default function AuthField({
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
    const showSuccess = isValid && (!focused || Boolean(error));
    const showClear = focused && value.length > 0 && !showSuccess;
    const status = error && !isValid ? 'error' : showSuccess ? 'success' : 'default';

    const icons: ReactNode[] = [];

    if (status === 'error') {
        icons.push(<ErrorIcon key="status" />);
    } else if (status === 'success') {
        icons.push(<SuccessIcon key="status" />);
    }

    if (isPassword) {
        icons.push(
            <button
                key="eye"
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setVisible((previous) => !previous)}
                className="flex items-center justify-center border-0 p-0 leading-none"
            >
                <EyeIcon crossed={visible} />
            </button>,
        );
    }

    if (showClear) {
        icons.push(
            <button
                key="clear"
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange('')}
                className="flex items-center justify-center border-0 p-0 leading-none"
            >
                <ClearIcon />
            </button>,
        );
    }

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
                        INPUT_PADDING_BY_ICON_COUNT[icons.length],
                    )}
                />

                {icons.map((icon, index) => (
                    <div
                        key={index}
                        className={cn(
                            'absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center',
                            ICON_POSITIONS[index],
                        )}
                    >
                        {icon}
                    </div>
                ))}
            </div>

            {status === 'error' && (
                <p className="text-error-text mt-1 text-sm leading-normal font-normal tracking-normal">
                    {error}
                </p>
            )}
        </div>
    );
}
