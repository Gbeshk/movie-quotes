import Button from '@/Components/Shared/Button';
import { cn } from '@/lib/cn';
import { useTranslation } from 'react-i18next';

export default function SaveCancelActions({
    formId,
    onCancel,
    processing,
    spread = false,
    onRequestSave,
}: {
    formId: string;
    onCancel: () => void;
    processing: boolean;
    spread?: boolean;
    onRequestSave?: () => void;
}) {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                'flex w-full items-center',
                spread ? 'justify-between' : 'mt-17 justify-end gap-4',
            )}
        >
            <button
                type="button"
                onClick={onCancel}
                className="flex h-12 w-40! cursor-pointer items-center justify-center rounded text-base text-white max-sm:w-24!"
            >
                {t('common.cancel')}
            </button>
            <Button
                type={onRequestSave ? 'button' : 'submit'}
                form={onRequestSave ? undefined : formId}
                onClick={onRequestSave}
                variant="cta"
                disabled={processing}
                className="h-12 w-40!"
            >
                {t('common.saveChanges')}
            </Button>
        </div>
    );
}
