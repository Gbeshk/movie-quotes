import Button from '@/Components/Shared/Button';
import CheckCircleIcon from '@/Components/Shared/Icons/CheckCircleIcon';
import Modal from '@/Components/Shared/Modal';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function EmailVerifiedModal({
    show,
    onClose,
}: {
    show: boolean;
    onClose: () => void;
}) {
    const { t } = useTranslation();

    return (
        <Modal show={show} onClose={onClose} cardClassName="w-full max-w-134.5 px-22 py-18">
            <CheckCircleIcon />
            <h2 className="mt-5 text-3xl leading-[1.2] font-medium tracking-normal text-white">
                {t('emailVerified.thankYou')}
            </h2>
            <h3 className="mt-8 w-full text-center text-base leading-normal font-normal text-white">
                {t('emailVerified.subtitle')}
            </h3>
            <Button
                type="button"
                variant="cta"
                onClick={() => router.visit(route('feed'))}
                className="mt-6"
            >
                {t('emailVerified.goToFeed')}
            </Button>
        </Modal>
    );
}
