import { InertiaLinkProps, Link } from '@inertiajs/react';

type NavLinkVariant = 'default' | 'responsive';

export default function NavLink({
    active = false,
    variant = 'default',
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean; variant?: NavLinkVariant }) {
    if (variant === 'responsive') {
        return (
            <Link
                {...props}
                className={`flex w-full items-start border-l-4 py-2 ps-3 pe-4 ${
                    active
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800'
                } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
            >
                {children}
            </Link>
        );
    }

    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm leading-5 font-medium transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
