import DefaultAvatarIcon from '@/Components/Shared/Icons/DefaultAvatarIcon';
import { User } from '@/types';
import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

export default function AvatarUploadForm({
    user,
    avatarPreview,
    avatarInputRef,
    onFileChange,
    onSubmit,
}: {
    user: User;
    avatarPreview: string | null;
    avatarInputRef: RefObject<HTMLInputElement>;
    onFileChange: (file: File | null) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
    const { t } = useTranslation();

    return (
        <>
            <div className="absolute top-5.5 left-1/2 h-47 w-47 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-white">
                {avatarPreview || user.avatar_url ? (
                    <img
                        src={avatarPreview ?? user.avatar_url ?? undefined}
                        alt={user.username}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <DefaultAvatarIcon />
                )}
            </div>

            <form id="avatar-form" onSubmit={onSubmit}>
                <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                />
                <p
                    onClick={() => avatarInputRef.current?.click()}
                    className="mt-31 cursor-pointer text-center text-xl leading-relaxed font-normal tracking-normal text-white"
                >
                    {t('profile.uploadNewPhoto')}
                </p>
            </form>
        </>
    );
}
