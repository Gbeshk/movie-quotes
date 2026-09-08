import Button from '@/Components/Shared/Button';
import ImageUpload from '@/Components/Shared/ImageUpload';
import Modal from '@/Components/Shared/Modal';
import EditMovieFormFields from '@/Pages/Movies/Partials/EditMovieFormFields';
import MovieModalHeader from '@/Pages/Movies/Partials/MovieModalHeader';
import MovieModalUserRow from '@/Pages/Movies/Partials/MovieModalUserRow';
import { Movie, MovieFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function EditMovieModal({
    show,
    onClose,
    movie,
}: {
    show: boolean;
    onClose: () => void;
    movie: Movie;
}) {
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
            cardClassName="w-225 max-h-[90vh] max-sm:w-full overflow-y-auto py-10"
            cardBgClassName="bg-profile-modal-bg"
            backdropClassName=""
        >
            <MovieModalHeader title="edit movie" onClose={onClose} />
            <MovieModalUserRow />

            <EditMovieFormFields
                data={data}
                setData={setData}
                errors={errors}
                clearErrors={clearErrors}
            />
            <ImageUpload
                file={data.poster}
                existingImageUrl={movie.poster_url}
                heading="Replace photo"
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
                    Save changes
                </Button>
            </div>
        </Modal>
    );
}
