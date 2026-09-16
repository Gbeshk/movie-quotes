import PhotoIcon from '@/Components/Shared/Icons/PhotoIcon';
import { cn } from '@/lib/cn';
import { DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ImageUpload({
    file,
    onChange,
    error,
    existingImageUrl,
    heading,
    className = 'mt-6',
}: {
    file: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    existingImageUrl?: string | null;
    heading?: string;
    className?: string;
}) {
    const { t } = useTranslation();
    const resolvedHeading = heading ?? t('imageUpload.addPhoto');
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const imageUrl = previewUrl ?? existingImageUrl;

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);

        const droppedFile = e.dataTransfer.files?.[0];

        if (droppedFile && droppedFile.type.startsWith('image/')) {
            onChange(droppedFile);
        }
    };

    return (
        <div className={cn('w-full self-start px-8', className)}>
            {imageUrl ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'border-modal-secondary-text flex h-46 w-full gap-4.5 rounded border py-4 pr-6 pl-4',
                        isDraggingOver && 'border-danger',
                    )}
                >
                    <div className="border-logo-text h-full flex-1 overflow-hidden rounded-xs border border-dashed">
                        <img
                            src={imageUrl}
                            alt={t('imageUpload.posterPreview')}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <p className="text-logo-text align-middle text-base leading-6 font-bold tracking-normal uppercase">
                            {resolvedHeading}
                        </p>
                        <div className="mt-4.5 flex items-center gap-2">
                            <PhotoIcon />
                            <p className="text-xl leading-6 font-normal tracking-normal text-white">
                                {file ? file.name : t('imageUpload.dragDrop')}
                            </p>
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                        />
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="bg-choose-file-bg mt-4 flex cursor-pointer items-center justify-center gap-1 rounded-xs p-2.5 text-xl leading-6 font-normal tracking-normal text-white"
                        >
                            {t('imageUpload.chooseFile')}
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'border-modal-secondary-text flex h-21 w-full items-center gap-2 rounded border px-4',
                        isDraggingOver && 'border-danger',
                    )}
                >
                    <PhotoIcon />
                    <p className="text-xl leading-6 font-normal tracking-normal text-white">
                        {t('imageUpload.dragDrop')}
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                    />
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="bg-choose-file-bg ml-2 flex cursor-pointer items-center justify-center gap-1 rounded-xs p-2.5 text-xl leading-6 font-normal tracking-normal text-white"
                    >
                        {t('imageUpload.chooseFile')}
                    </button>
                </div>
            )}
            {error && (
                <p className="text-error-text mt-1 text-sm leading-normal font-normal tracking-normal">
                    {error}
                </p>
            )}
        </div>
    );
}
