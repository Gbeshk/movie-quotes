import { cn } from '@/lib/cn';
import { FormEventHandler, PropsWithChildren, useEffect } from 'react';

export default function Modal({
    show,
    onClose,
    title,
    subtitle,
    onSubmit,
    cardClassName = 'w-150 px-30 py-13.25 max-sm:w-full',
    cardBgClassName = 'bg-modal-bg',
    backdropClassName = 'bg-black/54 backdrop-blur-xs',
    contentClassName = 'items-center justify-center',
    titleClassName,
    children,
}: PropsWithChildren<{
    show: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    onSubmit?: FormEventHandler;
    cardClassName?: string;
    cardBgClassName?: string;
    backdropClassName?: string;
    contentClassName?: string;
    titleClassName?: string;
}>) {
    useEffect(() => {
        if (!show) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <div className={cn('z-modal fixed inset-0 w-full overflow-y-auto', backdropClassName)}>
            <div className="fixed inset-0 w-full" onClick={onClose} />

            <div className={cn('flex min-h-full w-full', contentClassName)}>
                <form
                    onSubmit={onSubmit ?? ((e) => e.preventDefault())}
                    className={cn(
                        'relative z-10 flex flex-col items-center rounded-lg',
                        cardBgClassName,
                        cardClassName,
                    )}
                >
                    {title && (
                        <h2
                            className={cn(
                                'text-center text-3xl leading-snug font-medium tracking-normal text-white',
                                titleClassName,
                            )}
                        >
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <h3 className="text-modal-secondary-text mt-3 text-center text-base leading-normal font-normal tracking-normal">
                            {subtitle}
                        </h3>
                    )}

                    {children}
                </form>
            </div>
        </div>
    );
}
