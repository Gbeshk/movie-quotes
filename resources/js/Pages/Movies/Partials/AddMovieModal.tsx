import Button from '@/Components/Shared/Button';
import FormField from '@/Components/Shared/FormField';
import Modal from '@/Components/Shared/Modal';
import AddMovieFormFields from '@/Pages/Movies/Partials/AddMovieFormFields';
import MovieModalHeader from '@/Pages/Movies/Partials/MovieModalHeader';
import MovieModalUserRow from '@/Pages/Movies/Partials/MovieModalUserRow';
import { MovieFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function AddMovieModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<MovieFormData>({
        title: { ka: '', en: '' },
        director: { ka: '', en: '' },
        genre: [],
        release_year: '',
        description: { ka: '', en: '' },
        poster: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('movies.store'), {
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
            cardClassName="w-225 max-h-[90vh] max-sm:w-full overflow-y-auto py-10"
            cardBgClassName="bg-profile-modal-bg"
            backdropClassName=""
        >
            <MovieModalHeader title="add movie" onClose={onClose} />
            <MovieModalUserRow />

            <AddMovieFormFields
                data={data}
                setData={setData}
                errors={errors}
                clearErrors={clearErrors}
            />
            <FormField
                variant="image"
                file={data.poster}
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
                    Add movie
                </Button>
            </div>
        </Modal>
    );
}
