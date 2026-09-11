import MoreIcon from '@/Components/Shared/Icons/MoreIcon';
import { cn } from '@/lib/cn';
import { ReactNode, useEffect, useRef, useState } from 'react';

export default function OptionsMenu({
    actions,
}: {
    actions: {
        label: string;
        icon: ReactNode;
        onClick: () => void;
        variant?: 'default' | 'danger';
    }[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <button type="button" onClick={() => setIsOpen((previous) => !previous)}>
                <MoreIcon />
            </button>

            {isOpen && (
                <div className="border-modal-secondary-text bg-header-bg absolute top-6 left-0 z-10 flex h-50 w-62.5 flex-col justify-between gap-4 rounded-lg px-10 py-8">
                    {actions.map((action) => (
                        <button
                            key={action.label}
                            type="button"
                            onClick={() => {
                                action.onClick();
                                setIsOpen(false);
                            }}
                            className="flex w-full cursor-pointer items-center gap-4 text-left"
                        >
                            {action.icon}
                            <span
                                className={cn(
                                    'text-base leading-relaxed font-normal tracking-normal text-white',
                                    action.variant === 'danger' && 'text-danger',
                                )}
                            >
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
