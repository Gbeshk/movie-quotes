import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export function useAvatarForm() {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const avatarForm = useForm<{ avatar: File | null }>({ avatar: null });

    const handleAvatarChange = (file: File | null) => {
        if (!file) {
            return;
        }

        avatarForm.setData('avatar', file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const submitAvatar: FormEventHandler = (e) => {
        e.preventDefault();

        avatarForm.post(route('profile.avatar'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                avatarForm.reset();
                setAvatarPreview(null);
            },
        });
    };

    const cancelAvatarEdit = () => {
        avatarForm.reset();
        avatarForm.clearErrors();
        setAvatarPreview(null);
    };

    return {
        avatarForm,
        avatarPreview,
        avatarInputRef,
        handleAvatarChange,
        submitAvatar,
        cancelAvatarEdit,
    };
}
