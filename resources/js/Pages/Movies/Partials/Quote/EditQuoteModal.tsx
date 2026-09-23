import Button from '@/Components/Shared/Button';
import EditImagePreview from '@/Components/Shared/EditImagePreview';
import TrashIcon from '@/Components/Shared/Icons/TrashIcon';
import Modal from '@/Components/Shared/Modal';
import ModalHeader from '@/Pages/Movies/Partials/ModalHeader';
import ModalUserRow from '@/Pages/Movies/Partials/ModalUserRow';
import QuoteFormFields from '@/Pages/Movies/Partials/Quote/QuoteFormFields';
import { Quote, QuoteFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function EditQuoteModal({
    show,
    onClose,
    quote,
    onDelete,
}: {
    show: boolean;
    onClose: () => void;
    quote: Quote;
    onDelete?: () => void;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, clearErrors, transform } =
        useForm<QuoteFormData>({
            text: { ka: quote.text.ka, en: quote.text.en },
            image: null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        transform((data) => ({ ...data, _method: 'patch' }));

        post(route('quotes.update', quote.id), {
            forceFormData: true,
            onSuccess: onClose,
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            cardClassName="w-225 max-h-modal max-sm:w-full max-sm:min-h-screen max-sm:max-h-screen max-sm:rounded-none overflow-y-auto py-10 pb-18"
            cardBgClassName="bg-profile-modal-bg"
            contentClassName="items-center justify-center max-sm:items-start"
        >
            <button
                type="button"
                onClick={onDelete}
                className="absolute top-10 left-8 flex cursor-pointer items-center gap-2 max-sm:top-11"
            >
                <TrashIcon />
                <p className="text-input-bg text-base leading-normal font-normal tracking-normal capitalize">
                    {t('common.delete')}
                </p>
            </button>
            <ModalHeader
                title={t('movies.editQuoteTitle')}
                onClose={onClose}
                titleClassName="max-sm:text-xl"
            />
            <ModalUserRow avatarClassName="max-sm:h-10 max-sm:w-10" />
            <QuoteFormFields data={data} setData={setData} errors={errors} />
            <EditImagePreview
                file={data.image}
                existingImageUrl={quote.image_url}
                onChange={(file) => {
                    setData('image', file);
                    clearErrors('image');
                }}
                error={errors.image}
                imageClassName="max-sm:h-75.5"
            />

            <div className="mt-15 flex w-full items-center justify-center px-8">
                <Button
                    type="submit"
                    variant="danger-cta"
                    disabled={processing}
                    className="h-12 text-xl leading-6 font-normal tracking-normal"
                >
                    {t('common.saveChanges')}
                </Button>
            </div>
        </Modal>
    );
}
