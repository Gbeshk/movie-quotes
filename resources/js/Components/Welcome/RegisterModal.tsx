import AuthSwitchPrompt from '@/Components/Shared/AuthSwitchPrompt';
import Button from '@/Components/Shared/Button';
import AuthGoogleButton from '@/Components/Welcome/AuthGoogleButton';
import FormField from '@/Components/Shared/FormField';
import Modal from '@/Components/Shared/Modal';
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
    validateUsername,
} from '@/lib/validators';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function RegisterModal({
    show,
    onClose,
    onSwitchToLogin,
    onUnverified,
}: {
    show: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
    onUnverified: (email: string, password: string) => void;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [passwordFieldsKey, setPasswordFieldsKey] = useState(0);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            preserveState: true,
            preserveScroll: true,
            onError: (formErrors) => {
                if ('verification' in formErrors) {
                    onUnverified(data.email, data.password);
                    return;
                }

                reset('password', 'password_confirmation');

                if (!formErrors.password) {
                    setPasswordFieldsKey((key) => key + 1);
                }
            },
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title={t('register.title')}
            subtitle={t('register.subtitle')}
        >
            <div className="mt-6 w-full space-y-4">
                <FormField
                    label={t('register.name')}
                    id="register_username"
                    placeholder={t('register.namePlaceholder')}
                    value={data.username}
                    onChange={(value) => setData('username', value)}
                    error={errors.username}
                    validate={validateUsername}
                    autoComplete="username"
                />

                <FormField
                    label={t('register.email')}
                    id="register_email"
                    type="text"
                    placeholder={t('register.emailPlaceholder')}
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    validate={validateEmail}
                    autoComplete="email"
                />

                <FormField
                    key={`password-${passwordFieldsKey}`}
                    label={t('register.password')}
                    id="register_password"
                    type="password"
                    placeholder={t('register.passwordPlaceholder')}
                    value={data.password}
                    onChange={(value) => setData('password', value)}
                    error={errors.password}
                    validate={validatePassword}
                    autoComplete="new-password"
                />

                <FormField
                    key={`password-confirmation-${passwordFieldsKey}`}
                    label={t('register.confirmPassword')}
                    id="register_password_confirmation"
                    type="password"
                    placeholder={t('register.confirmPasswordPlaceholder')}
                    value={data.password_confirmation}
                    onChange={(value) => setData('password_confirmation', value)}
                    error={errors.password_confirmation}
                    validate={validatePasswordConfirmation(data.password)}
                    autoComplete="new-password"
                />
            </div>

            <Button type="submit" variant="cta" disabled={processing} className="mt-6">
                {t('register.submit')}
            </Button>
            <AuthGoogleButton label={t('register.googleCta')} />
            <AuthSwitchPrompt
                prompt={t('register.switchPrompt')}
                actionLabel={t('register.switchAction')}
                onAction={onSwitchToLogin}
            />
        </Modal>
    );
}
