import BackArrowIcon from '@/Components/Shared/Icons/BackArrowIcon';
import FormField from '@/Components/Shared/FormField';
import SaveCancelActions from '@/Components/Shared/SaveCancelActions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/cn';
import {
    validateEmail,
    validateNewPassword,
    validatePasswordConfirmation,
    validateUsername,
} from '@/utils/validators';
import AccountDetailsForm from '@/Pages/Profile/Partials/AccountDetailsForm';
import AvatarUploadForm from '@/Pages/Profile/Partials/AvatarUploadForm';
import MobileFieldEditForm from '@/Pages/Profile/Partials/MobileFieldEditForm';
import PasswordForm from '@/Pages/Profile/Partials/PasswordForm';
import SaveConfirmModal from '@/Pages/Profile/Partials/SaveConfirmModal';
import SaveSuccessToast from '@/Pages/Profile/Partials/SaveSuccessToast';
import { useAccountDetailsForm } from '@/Pages/Profile/hooks/useAccountDetailsForm';
import { useAvatarForm } from '@/Pages/Profile/hooks/useAvatarForm';
import { usePasswordForm } from '@/Pages/Profile/hooks/usePasswordForm';
import { AuthenticatedPageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Edit() {
    const { t } = useTranslation();
    const user = usePage<AuthenticatedPageProps>().props.auth.user;
    const isGoogleUser = !user.has_password;

    const [showToast, setShowToast] = useState(false);

    const avatar = useAvatarForm();
    const account = useAccountDetailsForm(user, () => setShowToast(true));
    const password = usePasswordForm(() => setShowToast(true));

    const activeField: 'username' | 'email' | 'password' | null = account.editingUsername
        ? 'username'
        : account.editingEmail
          ? 'email'
          : password.editingPassword
            ? 'password'
            : null;

    const toggleUsername = () => {
        if (!account.editingUsername) {
            account.cancelEmailEdit();
            password.cancelPasswordEdit();
        }
        account.toggleUsername();
    };

    const toggleEmail = () => {
        if (!account.editingEmail) {
            account.cancelUsernameEdit();
            password.cancelPasswordEdit();
        }
        account.toggleEmail();
    };

    const togglePassword = () => {
        if (!password.editingPassword) {
            account.cancelUsernameEdit();
            account.cancelEmailEdit();
        }
        password.togglePassword();
    };

    const [showSaveConfirm, setShowSaveConfirm] = useState(false);

    const mobileFormId =
        activeField === 'username'
            ? 'mobile-username-form'
            : activeField === 'email'
              ? 'mobile-email-form'
              : activeField === 'password'
                ? 'mobile-password-form'
                : null;

    const mobileProcessing =
        activeField === 'password'
            ? password.passwordForm.processing
            : account.profileForm.processing;

    const canSave =
        activeField === 'username'
            ? validateUsername(account.profileForm.data.username) === true
            : activeField === 'email'
              ? validateEmail(account.profileForm.data.email) === true
              : activeField === 'password'
                ? password.passwordForm.data.current_password.trim().length > 0 &&
                  validateNewPassword(password.passwordForm.data.password) === true &&
                  validatePasswordConfirmation(password.passwordForm.data.password)(
                      password.passwordForm.data.password_confirmation,
                  ) === true
                : false;

    const requestSave = () => {
        if (canSave) {
            setShowSaveConfirm(true);
        }
    };

    const confirmSave = () => {
        setShowSaveConfirm(false);
        if (mobileFormId) {
            (document.getElementById(mobileFormId) as HTMLFormElement | null)?.requestSubmit();
        }
    };

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
                <div className="ml-profile-panel w-3/4 max-lg:mx-auto max-md:mx-0 max-md:w-auto max-sm:hidden">
                    <SaveCancelActions
                        formId="avatar-form"
                        onCancel={avatar.cancelAvatarEdit}
                        processing={avatar.avatarForm.processing}
                    />
                </div>
            )}

            {(account.usernameChanged || account.emailChanged) && (
                <div className="ml-profile-panel w-3/4 max-lg:mx-auto max-md:mx-0 max-md:w-auto max-sm:hidden">
                    <SaveCancelActions
                        formId="profile-form"
                        onCancel={account.cancelProfileEdit}
                        processing={account.profileForm.processing}
                    />
                </div>
            )}

            {password.passwordChanged && (
                <div className="ml-profile-panel w-3/4 max-lg:mx-auto max-md:mx-0 max-md:w-auto max-sm:hidden">
                    <SaveCancelActions
                        formId="password-form"
                        onCancel={password.cancelPasswordEdit}
                        processing={password.passwordForm.processing}
                    />
                </div>
            )}

            {activeField === 'username' && (
                <MobileFieldEditForm
                    formId="mobile-username-form"
                    onSubmit={account.submitProfile}
                    onBack={account.cancelUsernameEdit}
                    changed={account.usernameChanged}
                    onCancel={account.cancelUsernameEdit}
                    processing={account.profileForm.processing}
                    onRequestSave={requestSave}
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
            )}

            {activeField === 'email' && (
                <MobileFieldEditForm
                    formId="mobile-email-form"
                    onSubmit={account.submitProfile}
                    onBack={account.cancelEmailEdit}
                    changed={account.emailChanged}
                    onCancel={account.cancelEmailEdit}
                    processing={account.profileForm.processing}
                    onRequestSave={requestSave}
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
            )}

            {activeField === 'password' && (
                <MobileFieldEditForm
                    formId="mobile-password-form"
                    onSubmit={password.submitPassword}
                    onBack={password.cancelPasswordEdit}
                    formClassName="mt-8 flex flex-col gap-14"
                    changed={password.passwordChanged}
                    onCancel={password.cancelPasswordEdit}
                    processing={password.passwordForm.processing}
                    onRequestSave={requestSave}
                >
                    <FormField
                        label={t('profile.currentPassword')}
                        id="mobile-current_password"
                        type="password"
                        placeholder={t('profile.currentPasswordPlaceholder')}
                        value={password.passwordForm.data.current_password}
                        onChange={(value) =>
                            password.passwordForm.setData('current_password', value)
                        }
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
            )}

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
