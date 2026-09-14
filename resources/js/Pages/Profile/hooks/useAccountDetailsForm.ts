import { User } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export function useAccountDetailsForm(user: User) {
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);

    const profileForm = useForm({
        username: user.username,
        email: user.pending_email ?? user.email,
    });

    const usernameChanged = profileForm.data.username !== user.username;
    const emailChanged = profileForm.data.email !== (user.pending_email ?? user.email);

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();

        profileForm.patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUsername(false);
                setEditingEmail(false);
            },
        });
    };

    const cancelUsernameEdit = () => {
        setEditingUsername(false);
        profileForm.setData('username', user.username);
        profileForm.clearErrors('username');
    };

    const cancelEmailEdit = () => {
        setEditingEmail(false);
        profileForm.setData('email', user.pending_email ?? user.email);
        profileForm.clearErrors('email');
    };

    const cancelProfileEdit = () => {
        cancelUsernameEdit();
        cancelEmailEdit();
    };

    return {
        profileForm,
        editingUsername,
        editingEmail,
        usernameChanged,
        emailChanged,
        submitProfile,
        cancelProfileEdit,
        toggleUsername: () => (editingUsername ? cancelUsernameEdit() : setEditingUsername(true)),
        toggleEmail: () => (editingEmail ? cancelEmailEdit() : setEditingEmail(true)),
    };
}
