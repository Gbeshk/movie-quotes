import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmailSentIcon from '../Shared/Icons/EmailSentIcon';

export default function VerifyEmailModal({
    show,
    onClose,
    resendCredentials,
}: {
    show: boolean;
    onClose: () => void;
    resendCredentials?: { email: string; password: string };
}) {
    const { t } = useTranslation();
    const [resendSent, setResendSent] = useState(false);
    const [previousShow, setPreviousShow] = useState(show);

    if (show !== previousShow) {
        setPreviousShow(show);

        if (show) {
            setResendSent(false);
        }
    }

    const resend = () => {
        const url = resendCredentials ? route('verification.resend') : route('verification.send');

        router.post(url, resendCredentials ?? {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setResendSent(true),
        });
    };

    return (
        <Modal show={show} onClose={onClose} cardClassName="w-full max-w-134.5 px-22 py-18">
            <EmailSentIcon />
            <h2 className="mt-5 text-3xl leading-[1.2] font-medium tracking-normal text-white">
                {t('verifyEmail.thankYou')}
            </h2>
            <h3 className="mt-8 w-full text-center text-base leading-normal font-normal text-white">
                {t('verifyEmail.subtitle')}
            </h3>
            <Button
                type="button"
                variant="cta"
                onClick={() => {
                    window.open('https://mail.google.com', '_blank', 'noopener,noreferrer');
                    onClose();
                }}
                className="mt-6"
            >
                {t('common.goToEmail')}
            </Button>

            {resendSent ? (
                <p className="text-success mt-4 text-base leading-normal font-normal tracking-normal">
                    {t('login.resendSent')}
                </p>
            ) : (
                <button
                    type="button"
                    onClick={resend}
                    className="text-link-text mt-4 cursor-pointer text-base underline"
                >
                    {t('login.resend')}
                </button>
            )}
        </Modal>
    );
}
