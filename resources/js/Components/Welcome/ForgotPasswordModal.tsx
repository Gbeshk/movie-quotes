import Button from '@/Components/Shared/Button';
import FormField from '@/Components/Shared/FormField';
import ArrowLeftIcon from '@/Components/Shared/Icons/ArrowLeftIcon';
import EmailSentIcon from '@/Components/Shared/Icons/EmailSentIcon';
import Modal from '@/Components/Shared/Modal';
import { validateEmail } from '@/utils/validators';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordModal({
    show,
    onClose,
    onBackToLogin,
}: {
    show: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });
    const [sent, setSent] = useState(false);
    const [previousShow, setPreviousShow] = useState(show);

    if (show !== previousShow) {
        setPreviousShow(show);

        if (show) {
            setSent(false);
            reset();
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setSent(true),
        });
    };

    if (sent) {
        return (
            <Modal show={show} onClose={onClose} cardClassName="w-full max-w-134.5 px-22 py-12">
                <EmailSentIcon />
                <h2 className="mt-5 text-3xl leading-normal font-medium tracking-normal text-white">
                    {t('forgotPassword.checkEmailTitle')}
                </h2>
                <h3 className="mt-8 w-full text-center text-base leading-normal font-normal text-white">
                    {t('forgotPassword.checkEmailSubtitle')}
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

                <button
                    type="button"
                    onClick={onClose}
                    className="text-modal-secondary-text mt-8 cursor-pointer text-base"
                >
                    {t('forgotPassword.skipConfirmLater')}
                </button>
            </Modal>
        );
    }

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title={t('forgotPassword.title')}
            subtitle={t('forgotPassword.subtitle')}
        >
            <div className="mt-6 w-full space-y-4">
                <FormField
                    label={t('forgotPassword.email')}
                    id="forgot_password_email"
                    type="text"
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    validate={validateEmail}
                    autoComplete="username"
                />
            </div>
            <Button type="submit" variant="cta" disabled={processing} className="mt-4">
                {t('forgotPassword.submit')}
            </Button>
            <button
                type="button"
                onClick={onBackToLogin}
                className="text-modal-secondary-text mt-8 flex cursor-pointer items-center gap-2 text-base"
            >
                <ArrowLeftIcon />
                {t('forgotPassword.backToLogin')}
            </button>
        </Modal>
    );
}
