import Button from '@/Components/Shared/Button';
import ImageUpload from '@/Components/Shared/ImageUpload';
import Modal from '@/Components/Shared/Modal';
import GenreTags from '@/Pages/Movies/Partials/GenreTags';
import MovieDirector from '@/Pages/Movies/Partials/MovieDirector';
import MovieModalHeader from '@/Pages/Movies/Partials/MovieModalHeader';
import MovieModalUserRow from '@/Pages/Movies/Partials/MovieModalUserRow';
import QuoteFormFields from '@/Pages/Movies/Partials/QuoteFormFields';
import { Movie, QuoteFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function AddQuoteModal({
    show,
    onClose,
    movie,
}: {
    show: boolean;
    onClose: () => void;
    movie: Movie;
}) {
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<QuoteFormData>({
        text: { ka: '', en: '' },
        image: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('quotes.store', movie.id), {
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
            cardClassName="w-225 max-h-[90vh] max-sm:w-full overflow-y-auto py-10 pb-18"
            cardBgClassName="bg-profile-modal-bg"
            backdropClassName=""
        >
            <MovieModalHeader title="add quote" onClose={onClose} />
            <MovieModalUserRow />
            <div className="mt-7.5 flex h-40 w-full items-center gap-6 px-8">
                <div className="bg-input-bg h-full w-72.5 shrink-0 overflow-hidden rounded-xl">
                    {movie.poster_url && (
                        <img
                            src={movie.poster_url}
                            alt={movie.title.en}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-col justify-between gap-5">
                    <p className="text-logo-text text-2xl leading-relaxed font-medium tracking-normal">
                        {movie.title.en} ({movie.release_year})
                    </p>

                    <GenreTags genres={movie.genre} />
                    <MovieDirector director={movie.director.en} />
                </div>
            </div>
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
                    Add quote
                </Button>
            </div>
        </Modal>
    );
}
