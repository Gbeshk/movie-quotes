import FormFieldRow from '@/Components/Shared/FormFieldRow';
import ReadOnlyFieldRow from '@/Components/Shared/ReadOnlyFieldRow';
import { validateNewPassword, validatePasswordConfirmation } from '@/lib/validators';
import { InertiaFormProps } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function PasswordForm({
    passwordForm,
    editingPassword,
    onTogglePassword,
    onSubmit,
}: {
    passwordForm: InertiaFormProps<{
        current_password: string;
        password: string;
        password_confirmation: string;
    }>;
    editingPassword: boolean;
    onTogglePassword: () => void;
    onSubmit: FormEventHandler;
}) {
    const { t } = useTranslation();

    return (
        <form id="password-form" onSubmit={onSubmit} className="mt-14 flex w-132 flex-col">
            <ReadOnlyFieldRow
                label={t('profile.password')}
                value="••••••••••••"
                editing={editingPassword}
                onToggle={onTogglePassword}
            />

            {editingPassword && (
                <div className="mt-14 flex flex-col gap-14">
                    <FormFieldRow
                        label={t('profile.currentPassword')}
                        id="current_password"
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={(value) => passwordForm.setData('current_password', value)}
                        error={passwordForm.errors.current_password}
                        autoComplete="current-password"
                    />

                    <FormFieldRow
                        label={t('profile.newPassword')}
                        id="password"
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(value) => passwordForm.setData('password', value)}
                        error={passwordForm.errors.password}
                        validate={validateNewPassword}
                        autoComplete="new-password"
                    />

                    <FormFieldRow
                        label={t('profile.confirmPassword')}
                        id="password_confirmation"
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(value) => passwordForm.setData('password_confirmation', value)}
                        error={passwordForm.errors.password_confirmation}
                        validate={validatePasswordConfirmation(passwordForm.data.password)}
                        autoComplete="new-password"
                    />
                </div>
            )}
        </form>
    );
}
