import Button from '@/Components/Shared/Button';
import ImageUpload from '@/Components/Shared/ImageUpload';
import Modal from '@/Components/Shared/Modal';
import MoviePicker from '@/Pages/Feed/Partials/MoviePicker';
import ModalHeader from '@/Pages/Movies/Partials/ModalHeader';
import ModalUserRow from '@/Pages/Movies/Partials/ModalUserRow';
import MoviePreview from '@/Pages/Movies/Partials/Movie/MoviePreview';
import QuoteFormFields from '@/Pages/Movies/Partials/Quote/QuoteFormFields';
import { Movie, QuoteFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddQuoteModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    const { t } = useTranslation();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isChangingMovie, setIsChangingMovie] = useState(false);
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<
        QuoteFormData & { movie_id: number | null; redirect_to: 'feed' }
    >({
        text: { ka: '', en: '' },
        image: null,
        movie_id: null,
        redirect_to: 'feed',
    });

    const selectMovie = (selected: Movie) => {
        setMovie(selected);
        setData('movie_id', selected.id);
        clearErrors('movie_id');
        setIsChangingMovie(false);
    };

    const changeMovie = () => {
        setIsChangingMovie(true);
        setMovie(null);
    };

    const close = () => {
        setMovie(null);
        setIsChangingMovie(false);
        reset();
        onClose();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('quotes.store'), {
            forceFormData: true,
            onSuccess: close,
        });
    };

    return (
        <Modal
            show={show}
            onClose={close}
            onSubmit={submit}
            cardClassName="w-225 max-sm:w-full my-13 py-10 pb-10"
            cardBgClassName="bg-profile-modal-bg"
            backdropClassName=""
        >
            <ModalHeader title={t('movies.addQuoteTitle')} onClose={close} />
            <ModalUserRow />
            <QuoteFormFields data={data} setData={setData} errors={errors} />
            <ImageUpload
                file={data.image}
                onChange={(file) => {
                    setData('image', file);
                    clearErrors('image');
                }}
                error={errors.image}
                className="mt-6"
            />
            {movie ? (
                <MoviePreview
                    movie={movie}
                    className="mt-6"
                    action={
                        <button
                            type="button"
                            onClick={changeMovie}
                            className="text-modal-secondary-text ml-auto w-fit cursor-pointer self-start text-base leading-normal font-normal tracking-normal hover:underline"
                        >
                            {t('feed.changeMovie')}
                        </button>
                    }
                />
            ) : (
                <>
                    <MoviePicker onSelect={selectMovie} autoOpen={isChangingMovie} />
                    {errors.movie_id && (
                        <p className="text-error-text mt-1 w-full px-8 text-sm leading-normal font-normal tracking-normal">
                            {errors.movie_id}
                        </p>
                    )}
                </>
            )}

            <div className="mt-10 flex w-full items-center justify-center px-8">
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
