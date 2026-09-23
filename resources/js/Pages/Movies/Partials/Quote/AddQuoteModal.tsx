import Button from '@/Components/Shared/Button';
import ImageUpload from '@/Components/Shared/ImageUpload';
import Modal from '@/Components/Shared/Modal';
import ModalHeader from '@/Pages/Movies/Partials/ModalHeader';
import ModalUserRow from '@/Pages/Movies/Partials/ModalUserRow';
import MoviePreview from '@/Pages/Movies/Partials/Movie/MoviePreview';
import QuoteFormFields from '@/Pages/Movies/Partials/Quote/QuoteFormFields';
import { Movie, QuoteFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddQuoteModal({
    show,
    onClose,
    movie,
}: {
    show: boolean;
    onClose: () => void;
    movie: Movie;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<
        QuoteFormData & { movie_id: number }
    >({
        text: { ka: '', en: '' },
        image: null,
        movie_id: movie.id,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('quotes.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            cardClassName="w-225 max-h-modal max-sm:w-full max-sm:min-h-screen max-sm:max-h-screen max-sm:rounded-none overflow-y-auto py-10 pb-18"
            cardBgClassName="bg-profile-modal-bg"
        >
            <ModalHeader title={t('movies.addQuoteTitle')} onClose={onClose} />
            <ModalUserRow />
            <MoviePreview movie={movie} />
            <QuoteFormFields data={data} setData={setData} errors={errors} />
            <ImageUpload
                file={data.image}
                onChange={(file) => {
                    setData('image', file);
                    clearErrors('image');
                }}
                error={errors.image}
                className="mt-11.25"
            />

            <div className="mt-15 flex w-full items-center justify-center px-8">
                <Button
                    type="submit"
                    variant="danger-cta"
                    disabled={processing}
                    className="h-12 text-xl leading-6 font-normal tracking-normal"
                >
                    {t('movies.addQuote')}
                </Button>
            </div>
        </Modal>
    );
}
