import Button from '@/Components/Shared/Button';
import { useTranslation } from 'react-i18next';

export default function SaveCancelActions({
    formId,
    onCancel,
    processing,
}: {
    formId: string;
    onCancel: () => void;
    processing: boolean;
}) {
    const { t } = useTranslation();

    return (
        <div className="mt-17 flex w-250 items-center justify-end gap-4">
            <button
                type="button"
                onClick={onCancel}
                className="flex h-12 w-40! cursor-pointer items-center justify-center rounded text-base text-white"
            >
                {t('common.cancel')}
            </button>
            <Button
                type="submit"
                form={formId}
                variant="cta"
                disabled={processing}
                className="h-12 w-40!"
            >
                {t('common.saveChanges')}
            </Button>
        </div>
    );
}
