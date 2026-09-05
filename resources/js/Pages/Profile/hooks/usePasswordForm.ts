import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export function usePasswordForm() {
    const [editingPassword, setEditingPassword] = useState(false);

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const passwordChanged =
        passwordForm.data.current_password.length > 0 ||
        passwordForm.data.password.length > 0 ||
        passwordForm.data.password_confirmation.length > 0;

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();

        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setEditingPassword(false);
            },
        });
    };

    const cancelPasswordEdit = () => {
        setEditingPassword(false);
        passwordForm.reset();
        passwordForm.clearErrors();
    };

    return {
        passwordForm,
        editingPassword,
        passwordChanged,
        submitPassword,
        cancelPasswordEdit,
        togglePassword: () => (editingPassword ? cancelPasswordEdit() : setEditingPassword(true)),
    };
}
