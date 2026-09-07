import Modal from '@/Components/Shared/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function AddMovieModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    const { post, reset } = useForm<{
        title: { ka: string; en: string };
        director: { ka: string; en: string };
        genre: string;
        release_year: string;
        description: { ka: string; en: string };
        poster: File | null;
    }>({
        title: { ka: '', en: '' },
        director: { ka: '', en: '' },
        genre: '',
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
            cardClassName="w-225 h-250 max-sm:w-full overflow-y-auto px-8 py-10"
            cardBgClassName="bg-profile-modal-bg"
            backdropClassName=""
        ></Modal>
    );
}
