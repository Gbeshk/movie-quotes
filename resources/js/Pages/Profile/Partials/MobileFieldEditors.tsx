import FormField from '@/Components/Shared/FormField';
import { useAccountDetailsForm } from '@/Pages/Profile/hooks/useAccountDetailsForm';
import { usePasswordForm } from '@/Pages/Profile/hooks/usePasswordForm';
import MobileFieldEditForm from '@/Pages/Profile/Partials/MobileFieldEditForm';
import {
    validateEmail,
    validateNewPassword,
    validatePasswordConfirmation,
    validateUsername,
} from '@/utils/validators';
import { useTranslation } from 'react-i18next';

export default function MobileFieldEditors({
    activeField,
    account,
    password,
    onRequestSave,
}: {
    activeField: 'username' | 'email' | 'password' | null;
    account: ReturnType<typeof useAccountDetailsForm>;
    password: ReturnType<typeof usePasswordForm>;
    onRequestSave: () => void;
}) {
    const { t } = useTranslation();

    if (activeField === 'username') {
        return (
            <MobileFieldEditForm
                formId="mobile-username-form"
                onSubmit={account.submitProfile}
                onBack={account.cancelUsernameEdit}
                changed={account.usernameChanged}
                onCancel={account.cancelUsernameEdit}
                processing={account.profileForm.processing}
                onRequestSave={onRequestSave}
            >
                <FormField
                    label={t('profile.newUsername')}
                    id="mobile-username"
                    placeholder={t('profile.newUsernamePlaceholder')}
                    value={account.profileForm.data.username}
                    onChange={(value) => account.profileForm.setData('username', value)}
                    error={account.profileForm.errors.username}
                    validate={validateUsername}
                    autoComplete="username"
                    heightClassName="h-12"
                />
            </MobileFieldEditForm>
        );
    }

    if (activeField === 'email') {
        return (
            <MobileFieldEditForm
                formId="mobile-email-form"
                onSubmit={account.submitProfile}
                onBack={account.cancelEmailEdit}
                changed={account.emailChanged}
                onCancel={account.cancelEmailEdit}
                processing={account.profileForm.processing}
                onRequestSave={onRequestSave}
            >
                <FormField
                    label={t('profile.newEmail')}
                    id="mobile-email"
                    type="email"
                    placeholder={t('profile.newEmailPlaceholder')}
                    value={account.profileForm.data.email}
                    onChange={(value) => account.profileForm.setData('email', value)}
                    error={account.profileForm.errors.email}
                    validate={validateEmail}
                    autoComplete="email"
                    heightClassName="h-12"
                />
            </MobileFieldEditForm>
        );
    }

    if (activeField === 'password') {
        return (
            <MobileFieldEditForm
                formId="mobile-password-form"
                onSubmit={password.submitPassword}
                onBack={password.cancelPasswordEdit}
                formClassName="mt-8 flex flex-col gap-14"
                changed={password.passwordChanged}
                onCancel={password.cancelPasswordEdit}
                processing={password.passwordForm.processing}
                onRequestSave={onRequestSave}
            >
                <FormField
                    label={t('profile.currentPassword')}
                    id="mobile-current_password"
                    type="password"
                    placeholder={t('profile.currentPasswordPlaceholder')}
                    value={password.passwordForm.data.current_password}
                    onChange={(value) => password.passwordForm.setData('current_password', value)}
                    error={password.passwordForm.errors.current_password}
                    autoComplete="current-password"
                    heightClassName="h-12"
                />
                <FormField
                    label={t('profile.newPassword')}
                    id="mobile-password"
                    type="password"
                    placeholder={t('profile.newPasswordPlaceholder')}
                    value={password.passwordForm.data.password}
                    onChange={(value) => password.passwordForm.setData('password', value)}
                    error={password.passwordForm.errors.password}
                    validate={validateNewPassword}
                    autoComplete="new-password"
                    heightClassName="h-12"
                />
                <FormField
                    label={t('profile.confirmPassword')}
                    id="mobile-password_confirmation"
                    type="password"
                    placeholder={t('profile.confirmPasswordPlaceholder')}
                    value={password.passwordForm.data.password_confirmation}
                    onChange={(value) =>
                        password.passwordForm.setData('password_confirmation', value)
                    }
                    error={password.passwordForm.errors.password_confirmation}
                    validate={validatePasswordConfirmation(password.passwordForm.data.password)}
                    autoComplete="new-password"
                    heightClassName="h-12"
                />
            </MobileFieldEditForm>
        );
    }

    return null;
}
