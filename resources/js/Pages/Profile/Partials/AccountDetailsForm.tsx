import EditableFieldGroup from '@/Components/Shared/EditableFieldGroup';
import { validateEmail, validateUsername } from '@/utils/validators';
import { User } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function AccountDetailsForm({
    user,
    isGoogleUser,
    profileForm,
    editingUsername,
    editingEmail,
    onToggleUsername,
    onToggleEmail,
    onSubmit,
}: {
    user: User;
    isGoogleUser: boolean;
    profileForm: InertiaFormProps<{ username: string; email: string }>;
    editingUsername: boolean;
    editingEmail: boolean;
    onToggleUsername: () => void;
    onToggleEmail: () => void;
    onSubmit: FormEventHandler;
}) {
    const { t } = useTranslation();

    return (
        <form id="profile-form" onSubmit={onSubmit} className="mt-10 flex w-132 flex-col gap-14">
            <EditableFieldGroup
                readOnlyLabel={t('profile.username')}
                readOnlyValue={user.username}
                editing={editingUsername}
                onToggle={onToggleUsername}
                newFieldLabel={t('profile.newUsername')}
                id="username"
                value={profileForm.data.username}
                onChange={(value) => profileForm.setData('username', value)}
                error={profileForm.errors.username}
                validate={validateUsername}
                autoComplete="username"
            />

            <EditableFieldGroup
                readOnlyLabel={t('profile.email')}
                readOnlyValue={user.email}
                editing={editingEmail}
                onToggle={onToggleEmail}
                hideToggle={isGoogleUser}
                note={
                    user.pending_email
                        ? t('profile.pendingEmailNote', { email: user.pending_email })
                        : undefined
                }
                newFieldLabel={t('profile.newEmail')}
                id="email"
                type="email"
                value={profileForm.data.email}
                onChange={(value) => profileForm.setData('email', value)}
                error={profileForm.errors.email}
                validate={validateEmail}
                autoComplete="email"
            />
        </form>
    );
}
