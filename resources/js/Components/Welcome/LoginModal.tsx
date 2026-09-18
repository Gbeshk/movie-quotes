import AuthSwitchPrompt from '@/Components/Shared/AuthSwitchPrompt';
import Button from '@/Components/Shared/Button';
import Checkbox from '@/Components/Shared/Checkbox';
import AuthGoogleButton from '@/Components/Welcome/AuthGoogleButton';
import FormField from '@/Components/Shared/FormField';
import Modal from '@/Components/Shared/Modal';
import { validateEmail } from '@/utils/validators';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LoginModal({
    show,
    onClose,
    onSwitchToRegister,
    onForgotPassword,
}: {
    show: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
    onForgotPassword: () => void;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [unverified, setUnverified] = useState(false);
    const [resendSent, setResendSent] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (formErrors) => {
                if ('verification' in formErrors) {
                    setUnverified(true);
                    setResendSent(false);
                } else {
                    setUnverified(false);
                    reset('password');
                }
            },
        });
    };

    const resend = () => {
        router.post(
            route('verification.resend'),
            { email: data.email, password: data.password },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setResendSent(true),
            },
        );
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title={t('login.title')}
            subtitle={t('login.subtitle')}
        >
            <div className="mt-6 w-full space-y-4">
                <FormField
                    label={t('login.email')}
                    id="login_email"
                    type="text"
                    placeholder={t('login.emailPlaceholder')}
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    validate={validateEmail}
                    autoComplete="username"
                />

                <FormField
                    label={t('login.password')}
                    id="login_password"
                    type="password"
                    placeholder={t('login.passwordPlaceholder')}
                    value={data.password}
                    onChange={(value) => setData('password', value)}
                    error={errors.password}
                    autoComplete="current-password"
                />
            </div>

            {unverified && (
                <div className="mt-4 w-full">
                    <p className="text-error-text text-sm leading-normal font-normal tracking-normal">
                        {t('login.unverified')}
                    </p>

                    {resendSent ? (
                        <p className="text-success mt-2 text-sm leading-normal font-normal tracking-normal">
                            {t('login.resendSent')}
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={resend}
                            className="text-link-text mt-2 cursor-pointer text-sm underline"
                        >
                            {t('login.resend')}
                        </button>
                    )}
                </div>
            )}

            <div className="mt-4 flex w-full items-center justify-between">
                <Checkbox
                    checked={data.remember}
                    onChange={(checked) => setData('remember', checked)}
                    label={t('login.rememberMe')}
                />
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-link-text cursor-pointer text-base underline"
                >
                    {t('login.forgotPassword')}
                </button>
            </div>
            <Button type="submit" variant="cta" disabled={processing} className="mt-4">
                {t('login.submit')}
            </Button>
            <AuthGoogleButton label={t('login.googleCta')} />
            <AuthSwitchPrompt
                prompt={t('login.switchPrompt')}
                actionLabel={t('login.switchAction')}
                onAction={onSwitchToRegister}
            />
        </Modal>
    );
}
