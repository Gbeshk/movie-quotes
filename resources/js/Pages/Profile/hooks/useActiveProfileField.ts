import { useAccountDetailsForm } from '@/Pages/Profile/hooks/useAccountDetailsForm';
import { usePasswordForm } from '@/Pages/Profile/hooks/usePasswordForm';
import { useState } from 'react';
import {
    validateEmail,
    validateNewPassword,
    validatePasswordConfirmation,
    validateUsername,
} from '@/utils/validators';

type ActiveField = 'username' | 'email' | 'password' | null;

export function useActiveProfileField(
    account: ReturnType<typeof useAccountDetailsForm>,
    password: ReturnType<typeof usePasswordForm>,
) {
    const activeField: ActiveField = account.editingUsername
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

    return {
        activeField,
        toggleUsername,
        toggleEmail,
        togglePassword,
        showSaveConfirm,
        setShowSaveConfirm,
        mobileProcessing,
        requestSave,
        confirmSave,
    };
}
