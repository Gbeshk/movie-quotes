import { cn } from '@/lib/cn';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PhotoIcon from './Icons/PhotoIcon';

export default function EditImagePreview({
    file,
    existingImageUrl,
    onChange,
    error,
    imageClassName,
    readOnly = false,
}: {
    file: File | null;
    existingImageUrl?: string | null;
    onChange: (file: File | null) => void;
    error?: string;
    imageClassName?: string;
    readOnly?: boolean;
}) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const imageUrl = previewUrl ?? existingImageUrl;

    return (
        <div className="mt-6 w-full px-8">
            <div className={cn('relative h-125 w-full overflow-hidden rounded-xl', imageClassName)}>
                {imageUrl && <img src={imageUrl} alt="" className="h-full w-full object-cover" />}
                {!readOnly && (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="backdrop-blur-50 bg-gradient-dark flex h-21 w-33.75 cursor-pointer flex-col items-center justify-between rounded-xl py-4.5 text-base font-normal text-white opacity-80"
                            >
                                <PhotoIcon />
                                {t('imageUpload.changeImage')}
                            </button>
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                        />
                    </>
                )}
            </div>
            {error && (
                <p className="text-error-text mt-1 text-sm leading-normal font-normal tracking-normal">
                    {error}
                </p>
            )}
        </div>
    );
}
