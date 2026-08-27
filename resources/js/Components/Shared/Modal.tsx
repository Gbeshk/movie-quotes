import { FormEventHandler, PropsWithChildren } from 'react';

export default function Modal({
    show,
    onClose,
    title,
    subtitle,
    onSubmit,
    children,
}: PropsWithChildren<{
    show: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    onSubmit: FormEventHandler;
}>) {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/54 backdrop-blur-xs">
            <div className="fixed inset-0 w-full" onClick={onClose} />

            <form
                onSubmit={onSubmit}
                className="bg-modal-bg relative z-10 flex w-150 flex-col items-center rounded-lg px-30 py-13.25 max-sm:w-full"
            >
                <h2 className="text-3xl leading-snug font-medium tracking-normal text-white">
                    {title}
                </h2>
                <h3 className="text-modal-secondary-text mt-3 align-middle text-base leading-normal font-normal tracking-normal">
                    {subtitle}
                </h3>

                {children}
            </form>
        </div>
    );
}
