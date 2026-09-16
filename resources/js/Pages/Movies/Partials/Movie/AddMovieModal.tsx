import Button from '@/Components/Shared/Button';
import ImageUpload from '@/Components/Shared/ImageUpload';
import Modal from '@/Components/Shared/Modal';
import ModalHeader from '@/Pages/Movies/Partials/ModalHeader';
import ModalUserRow from '@/Pages/Movies/Partials/ModalUserRow';
import AddMovieFormFields from '@/Pages/Movies/Partials/Movie/AddMovieFormFields';
import { MovieFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddMovieModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    const { t } = useTranslation();
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
            <ModalHeader title={t('movies.addMovieTitle')} onClose={onClose} />
            <ModalUserRow />

            <AddMovieFormFields
                data={data}
                setData={setData}
                errors={errors}
                clearErrors={clearErrors}
            />
            <ImageUpload
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
                    {t('movies.addMovie')}
                </Button>
            </div>
        </Modal>
    );
}
