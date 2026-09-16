import SaveCancelActions from '@/Components/Shared/SaveCancelActions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AccountDetailsForm from '@/Pages/Profile/Partials/AccountDetailsForm';
import AvatarUploadForm from '@/Pages/Profile/Partials/AvatarUploadForm';
import PasswordForm from '@/Pages/Profile/Partials/PasswordForm';
import { useAccountDetailsForm } from '@/Pages/Profile/hooks/useAccountDetailsForm';
import { useAvatarForm } from '@/Pages/Profile/hooks/useAvatarForm';
import { usePasswordForm } from '@/Pages/Profile/hooks/usePasswordForm';
import { AuthenticatedPageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Edit() {
    const { t } = useTranslation();
    const user = usePage<AuthenticatedPageProps>().props.auth.user;
    const isGoogleUser = Boolean(user.google_id);

    const avatar = useAvatarForm();
    const account = useAccountDetailsForm(user);
    const password = usePasswordForm();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="ml-15 text-2xl leading-normal font-medium tracking-normal text-white">
                    {t('profile.heading')}
                </h2>
            }
        >
            <div className="bg-profile-modal-bg relative mt-31.25 flex min-h-175.75 w-250 flex-col items-center rounded-xl pb-16 backdrop-blur-2xl">
                <AvatarUploadForm
                    user={user}
                    avatarPreview={avatar.avatarPreview}
                    avatarInputRef={avatar.avatarInputRef}
                    onFileChange={avatar.handleAvatarChange}
                    onSubmit={avatar.submitAvatar}
                />

                <AccountDetailsForm
                    user={user}
                    isGoogleUser={isGoogleUser}
                    profileForm={account.profileForm}
                    editingUsername={account.editingUsername}
                    editingEmail={account.editingEmail}
                    onToggleUsername={account.toggleUsername}
                    onToggleEmail={account.toggleEmail}
                    onSubmit={account.submitProfile}
                />

                {!isGoogleUser && (
                    <PasswordForm
                        passwordForm={password.passwordForm}
                        editingPassword={password.editingPassword}
                        onTogglePassword={password.togglePassword}
                        onSubmit={password.submitPassword}
                    />
                )}
            </div>

            {avatar.avatarForm.data.avatar && (
                <SaveCancelActions
                    formId="avatar-form"
                    onCancel={avatar.cancelAvatarEdit}
                    processing={avatar.avatarForm.processing}
                />
            )}

            {(account.usernameChanged || account.emailChanged) && (
                <SaveCancelActions
                    formId="profile-form"
                    onCancel={account.cancelProfileEdit}
                    processing={account.profileForm.processing}
                />
            )}

            {password.passwordChanged && (
                <SaveCancelActions
                    formId="password-form"
                    onCancel={password.cancelPasswordEdit}
                    processing={password.passwordForm.processing}
                />
            )}
        </AuthenticatedLayout>
    );
}
