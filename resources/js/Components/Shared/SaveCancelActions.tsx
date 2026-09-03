import Button from '@/Components/Shared/Button';

export default function SaveCancelActions({
    formId,
    onCancel,
    processing,
}: {
    formId: string;
    onCancel: () => void;
    processing: boolean;
}) {
    return (
        <div className="mt-17 flex w-250 items-center justify-end gap-4">
            <button
                type="button"
                onClick={onCancel}
                className="flex h-12 w-40! cursor-pointer items-center justify-center rounded text-base text-white"
            >
                Cancel
            </button>
            <Button
                type="submit"
                form={formId}
                variant="cta"
                disabled={processing}
                className="h-12 w-40!"
            >
                Save changes
            </Button>
        </div>
    );
}
