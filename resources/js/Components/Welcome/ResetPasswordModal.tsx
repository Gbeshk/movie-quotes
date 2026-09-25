import Button from '@/Components/Shared/Button';
import FormField from '@/Components/Shared/FormField';
import ArrowLeftIcon from '@/Components/Shared/Icons/ArrowLeftIcon';
import CheckCircleIcon from '@/Components/Shared/Icons/CheckCircleIcon';
import CloseIcon from '@/Components/Shared/Icons/CloseIcon';
import LinkExpiredIcon from '@/Components/Shared/Icons/LinkExpiredIcon';
import Modal from '@/Components/Shared/Modal';
import { validatePassword, validatePasswordConfirmation } from '@/utils/validators';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordModal({
    show,
    onClose,
    onBackToLogin,
    onSuccess,
    onRequestNewLink,
    token,
    email,
    initiallyExpired,
}: {
    show: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
    onSuccess: () => void;
    onRequestNewLink: () => void;
    token: string;
    email: string;
    initiallyExpired: boolean;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const [expired, setExpired] = useState(initiallyExpired);
    const [changed, setChanged] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setExpired(false);

        post(route('password.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setChanged(true);
            },
            onError: () => setExpired(true),
        });
    };

    if (changed) {
        return (
            <Modal
                show={show}
                onClose={onClose}
                cardClassName="w-full max-w-134.5 px-22 py-18 max-sm:min-h-screen max-sm:rounded-none max-sm:px-8.5 max-sm:pt-18 max-sm:pb-10"
                cardBgClassName="bg-modal-bg max-sm:bg-gradient-dark max-sm:bg-black"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 hidden cursor-pointer max-sm:block"
                >
                    <CloseIcon />
                </button>
                <CheckCircleIcon />
                <h2 className="leading-heading mt-5 text-3xl font-medium tracking-normal text-white max-sm:text-2xl">
                    {t('resetPassword.successTitle')}
                </h2>
                <h3 className="mt-8 w-full text-center text-base leading-normal font-normal text-white">
                    {t('resetPassword.successSubtitle')}
                </h3>
                <Button type="button" variant="cta" onClick={onSuccess} className="mt-6">
                    {t('resetPassword.logIn')}
                </Button>
            </Modal>
        );
    }

    if (expired) {
        return (
            <Modal
                show={show}
                onClose={onClose}
                cardClassName="w-full max-w-137 px-22 py-18 max-sm:min-h-screen max-sm:rounded-none max-sm:px-8.5 max-sm:pt-18 max-sm:pb-10"
                cardBgClassName="bg-modal-bg max-sm:bg-gradient-dark max-sm:bg-black"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 hidden cursor-pointer max-sm:block"
                >
                    <CloseIcon />
                </button>
                <LinkExpiredIcon />
                <h2 className="leading-heading mt-5 text-3xl font-medium tracking-normal text-white">
                    {t('resetPassword.linkExpiredTitle')}
                </h2>
                <h3 className="mt-8 w-full text-center text-base leading-normal font-normal text-white">
                    {t('resetPassword.linkExpiredSubtitle')}
                </h3>
                <Button type="button" variant="cta" onClick={onRequestNewLink} className="mt-6">
                    {t('resetPassword.requestAnotherLink')}
                </Button>
            </Modal>
        );
    }

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title={t('resetPassword.title')}
            subtitle={t('resetPassword.subtitle')}
            cardClassName="w-150 px-30 py-13.25 max-sm:w-full max-sm:min-h-screen max-sm:rounded-none max-sm:px-8.5 max-sm:pt-18 max-sm:pb-10"
            cardBgClassName="bg-modal-bg max-sm:bg-gradient-dark max-sm:bg-black"
            titleClassName="max-sm:text-2xl"
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute top-6 right-6 hidden cursor-pointer max-sm:block"
            >
                <CloseIcon />
            </button>
            <div className="mt-6 w-full space-y-4">
                <FormField
                    label={t('resetPassword.newPassword')}
                    id="reset_password_password"
                    type="password"
                    placeholder={t('resetPassword.newPasswordPlaceholder')}
                    value={data.password}
                    onChange={(value) => setData('password', value)}
                    error={errors.password}
                    validate={validatePassword}
                    autoComplete="new-password"
                />

                <FormField
                    label={t('resetPassword.confirmNewPassword')}
                    id="reset_password_password_confirmation"
                    type="password"
                    placeholder={t('resetPassword.confirmNewPasswordPlaceholder')}
                    value={data.password_confirmation}
                    onChange={(value) => setData('password_confirmation', value)}
                    error={errors.password_confirmation}
                    validate={validatePasswordConfirmation(data.password)}
                    autoComplete="new-password"
                />
            </div>
            <Button type="submit" variant="cta" disabled={processing} className="mt-4">
                {t('resetPassword.submit')}
            </Button>
            <button
                type="button"
                onClick={onBackToLogin}
                className="text-modal-secondary-text mt-8 flex cursor-pointer items-center gap-2 text-base"
            >
                <ArrowLeftIcon />
                {t('resetPassword.backToLogin')}
            </button>
        </Modal>
    );
}
