import BackArrowIcon from '@/Components/Shared/Icons/BackArrowIcon';
import SaveCancelActions from '@/Components/Shared/SaveCancelActions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/cn';
import AccountDetailsForm from '@/Pages/Profile/Partials/AccountDetailsForm';
import AvatarUploadForm from '@/Pages/Profile/Partials/AvatarUploadForm';
import MobileFieldEditors from '@/Pages/Profile/Partials/MobileFieldEditors';
import PasswordForm from '@/Pages/Profile/Partials/PasswordForm';
import SaveConfirmModal from '@/Pages/Profile/Partials/SaveConfirmModal';
import SaveSuccessToast from '@/Pages/Profile/Partials/SaveSuccessToast';
import { useAccountDetailsForm } from '@/Pages/Profile/hooks/useAccountDetailsForm';
import { useActiveProfileField } from '@/Pages/Profile/hooks/useActiveProfileField';
import { useAvatarForm } from '@/Pages/Profile/hooks/useAvatarForm';
import { usePasswordForm } from '@/Pages/Profile/hooks/usePasswordForm';
import { AuthenticatedPageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function ProfileSaveBar({
    formId,
    onCancel,
    processing,
}: {
    formId: string;
    onCancel: () => void;
    processing: boolean;
}) {
    return (
        <div className="ml-profile-panel w-3/4 max-lg:mx-auto max-md:mx-0 max-md:w-auto max-sm:hidden">
            <SaveCancelActions formId={formId} onCancel={onCancel} processing={processing} />
        </div>
    );
}

export default function Edit() {
    const { t } = useTranslation();
    const user = usePage<AuthenticatedPageProps>().props.auth.user;
    const isGoogleUser = !user.has_password;

    const [showToast, setShowToast] = useState(false);

    const avatar = useAvatarForm();
    const account = useAccountDetailsForm(user, () => setShowToast(true));
    const password = usePasswordForm(() => setShowToast(true));

    const {
        activeField,
        toggleUsername,
        toggleEmail,
        togglePassword,
        showSaveConfirm,
        setShowSaveConfirm,
        mobileProcessing,
        requestSave,
        confirmSave,
    } = useActiveProfileField(account, password);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="ml-profile-heading text-2xl leading-normal font-medium tracking-normal text-white max-lg:ml-0 max-lg:text-center max-sm:hidden">
                    {t('profile.heading')}
                </h2>
            }
        >
            <div
                className={cn(
                    'bg-profile-modal-bg max-sm:bg-header-bg ml-profile-panel relative mt-31.25 flex min-h-175.75 w-3/4 flex-col items-center rounded-xl pb-16 backdrop-blur-2xl max-lg:mx-auto max-md:mx-0 max-md:w-auto max-sm:-mx-8 max-sm:mt-16',
                    activeField && 'max-sm:hidden',
                )}
            >
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="absolute -top-12 left-7 hidden cursor-pointer max-sm:block"
                >
                    <BackArrowIcon />
                </button>

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
                    onToggleUsername={toggleUsername}
                    onToggleEmail={toggleEmail}
                    onSubmit={account.submitProfile}
                />

                {!isGoogleUser && (
                    <PasswordForm
                        passwordForm={password.passwordForm}
                        editingPassword={password.editingPassword}
                        onTogglePassword={togglePassword}
                        onSubmit={password.submitPassword}
                    />
                )}
            </div>

            {avatar.avatarForm.data.avatar && (
                <ProfileSaveBar
                    formId="avatar-form"
                    onCancel={avatar.cancelAvatarEdit}
                    processing={avatar.avatarForm.processing}
                />
            )}

            {(account.usernameChanged || account.emailChanged) && (
                <ProfileSaveBar
                    formId="profile-form"
                    onCancel={account.cancelProfileEdit}
                    processing={account.profileForm.processing}
                />
            )}

            {password.passwordChanged && (
                <ProfileSaveBar
                    formId="password-form"
                    onCancel={password.cancelPasswordEdit}
                    processing={password.passwordForm.processing}
                />
            )}

            <MobileFieldEditors
                activeField={activeField}
                account={account}
                password={password}
                onRequestSave={requestSave}
            />

            <SaveConfirmModal
                show={showSaveConfirm}
                onCancel={() => setShowSaveConfirm(false)}
                onConfirm={confirmSave}
                processing={mobileProcessing}
            />

            {showToast && <SaveSuccessToast onClose={() => setShowToast(false)} />}
        </AuthenticatedLayout>
    );
}
