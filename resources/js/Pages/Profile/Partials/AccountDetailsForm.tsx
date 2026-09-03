import EditableFieldGroup from '@/Components/Shared/EditableFieldGroup';
import { validateEmail, validateUsername } from '@/lib/validators';
import { User } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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
    return (
        <form id="profile-form" onSubmit={onSubmit} className="mt-10 flex w-132 flex-col gap-14">
            <EditableFieldGroup
                readOnlyLabel="Username"
                readOnlyValue={user.username}
                editing={editingUsername}
                onToggle={onToggleUsername}
                newFieldLabel="New username"
                id="username"
                value={profileForm.data.username}
                onChange={(value) => profileForm.setData('username', value)}
                error={profileForm.errors.username}
                validate={validateUsername}
                autoComplete="username"
            />

            <EditableFieldGroup
                readOnlyLabel="Email"
                readOnlyValue={user.email}
                editing={editingEmail}
                onToggle={onToggleEmail}
                hideToggle={isGoogleUser}
                newFieldLabel="New email"
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
