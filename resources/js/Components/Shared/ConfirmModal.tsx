import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    subtitle,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
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
    return (
        <Modal show={show} onClose={onClose} title={title} subtitle={subtitle}>
            <div className="mt-8 flex w-full items-center justify-center gap-4 px-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="border-modal-secondary-text text-modal-secondary-text h-9.5 flex-1 cursor-pointer rounded border text-base"
                >
                    {cancelLabel}
                </button>
                <div className="flex-1">
                    <Button
                        type="button"
                        variant="danger-cta"
                        onClick={onConfirm}
                        disabled={confirmDisabled}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
