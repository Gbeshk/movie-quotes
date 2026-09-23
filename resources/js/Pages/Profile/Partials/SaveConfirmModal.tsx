import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import { useTranslation } from 'react-i18next';

export default function SaveConfirmModal({
    show,
    onCancel,
    onConfirm,
    processing,
}: {
    show: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    processing: boolean;
}) {
    const { t } = useTranslation();

    return (
        <Modal
            show={show}
            onClose={onCancel}
            contentClassName="items-center justify-center px-6"
            cardClassName="h-52 w-full px-4 md:hidden"
            cardBgClassName="bg-header-bg"
        >
            <p className="mt-16 text-base leading-normal font-normal tracking-normal text-white">
                {t('profile.confirmSaveChanges')}
            </p>

            <div className="bg-input-bg/20 -mx-4 mt-10 h-px self-stretch" />

            <div className="mt-4 flex w-full items-center justify-between">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-12 w-24! cursor-pointer items-center justify-center rounded text-base text-white"
                >
                    {t('common.cancel')}
                </button>
                <Button
                    type="button"
                    onClick={onConfirm}
                    variant="cta"
                    disabled={processing}
                    className="h-12 w-24!"
                >
                    {t('common.confirm')}
                </Button>
            </div>
        </Modal>
    );
}
