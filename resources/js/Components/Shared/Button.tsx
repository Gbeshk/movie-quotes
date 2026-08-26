import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'border-transparent bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700 focus:ring-indigo-500 active:bg-gray-900',
    secondary:
        'border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'border-transparent bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 active:bg-red-700',
};

export default function Button({
    variant = 'primary',
    type,
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
    return (
        <button
            {...props}
            type={type ?? (variant === 'secondary' ? 'button' : undefined)}
            className={
                `inline-flex items-center rounded-md border px-4 py-2 text-xs font-semibold tracking-widest uppercase transition duration-150 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none ${variantClasses[variant]} ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
