import Button from '@/Components/Shared/Button';
import ImageUpload from '@/Components/Shared/ImageUpload';
import Modal from '@/Components/Shared/Modal';
import ModalHeader from '@/Pages/Movies/Partials/ModalHeader';
import ModalUserRow from '@/Pages/Movies/Partials/ModalUserRow';
import EditMovieFormFields from '@/Pages/Movies/Partials/Movie/EditMovieFormFields';
import { Movie, MovieFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function EditMovieModal({
    show,
    onClose,
    movie,
}: {
    show: boolean;
    onClose: () => void;
    movie: Movie;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, clearErrors, transform } =
        useForm<MovieFormData>({
            title: { ka: movie.title.ka, en: movie.title.en },
            director: { ka: movie.director.ka, en: movie.director.en },
            genre: movie.genre,
            release_year: String(movie.release_year),
            description: { ka: movie.description.ka, en: movie.description.en },
            poster: null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        transform((data) => ({ ...data, _method: 'put' }));

        post(route('movies.update', movie.id), {
            forceFormData: true,
            onSuccess: onClose,
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            cardClassName="w-225 max-h-modal max-sm:w-full max-sm:min-h-screen max-sm:max-h-screen max-sm:rounded-none overflow-y-auto py-10"
            cardBgClassName="bg-profile-modal-bg"
            backdropClassName=""
        >
            <ModalHeader
                title={t('movies.editMovieTitle')}
                onClose={onClose}
                titleClassName="max-sm:text-xl"
            />
            <ModalUserRow />

            <EditMovieFormFields
                data={data}
                setData={setData}
                errors={errors}
                clearErrors={clearErrors}
            />
            <ImageUpload
                file={data.poster}
                existingImageUrl={movie.poster_url}
                heading={t('movies.replacePhoto')}
                onChange={(file) => {
                    setData('poster', file);
                    clearErrors('poster');
                }}
                error={errors.poster}
            />

            <div className="mt-10 flex w-full items-center justify-center px-8">
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
