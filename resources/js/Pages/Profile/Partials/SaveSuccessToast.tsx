import ToastCloseIcon from '@/Components/Shared/Icons/ToastCloseIcon';
import ToastSuccessIcon from '@/Components/Shared/Icons/ToastSuccessIcon';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function SaveSuccessToast({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        const timeout = setTimeout(() => onCloseRef.current(), 4000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="border-toast-success-border bg-toast-success-bg fixed inset-x-4 top-32 z-50 flex h-14.5 items-center justify-between rounded border pr-4 pl-4 md:hidden">
            <div className="flex items-center gap-2">
                <ToastSuccessIcon />
                <span className="text-toast-success-text text-base leading-normal font-normal tracking-normal">
                    {t('profile.changesUpdated')}
                </span>
            </div>
            <button type="button" onClick={onClose} className="cursor-pointer">
                <ToastCloseIcon />
            </button>
        </div>
    );
}
