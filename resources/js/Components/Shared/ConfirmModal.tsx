import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import { useTranslation } from 'react-i18next';

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    subtitle,
    confirmLabel,
    cancelLabel,
    confirmDisabled,
}: {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    subtitle?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmDisabled?: boolean;
}) {
    const { t } = useTranslation();

    return (
        <Modal show={show} onClose={onClose} title={title} subtitle={subtitle}>
            <div className="mt-8 flex w-full items-center justify-center gap-4 px-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="border-modal-secondary-text text-modal-secondary-text h-9.5 flex-1 cursor-pointer rounded border text-base"
                >
                    {cancelLabel ?? t('common.cancel')}
                </button>
                <div className="flex-1">
                    <Button
                        type="button"
                        variant="danger-cta"
                        onClick={onConfirm}
                        disabled={confirmDisabled}
                    >
                        {confirmLabel ?? t('common.confirm')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
