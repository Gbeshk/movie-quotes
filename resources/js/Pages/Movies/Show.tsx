import ConfirmModal from '@/Components/Shared/ConfirmModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AuthenticatedPageProps, Movie } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import EditMovieModal from './Partials/EditMovieModal';
import MovieDetails from './Partials/MovieDetails';
import MovieQuotesHeader from './Partials/MovieQuotesHeader';

export default function Show({ movie }: { movie: Movie }) {
    const { auth } = usePage<AuthenticatedPageProps>().props;
    const isOwner = auth.user.id === movie.user_id;
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { delete: destroy, processing } = useForm();
    const confirmDelete = () => {
        destroy(route('movies.destroy', movie.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={movie.title.en} />

            {isOwner && (
                <EditMovieModal show={showEdit} onClose={() => setShowEdit(false)} movie={movie} />
            )}

            <ConfirmModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                confirmDisabled={processing}
                title="Delete this movie?"
                subtitle="This will also delete all of its quotes. This cannot be undone."
                confirmLabel="Delete"
            />

            <div className="w-full">
                <div className="flex items-center justify-between">
                    <p className="text-2xl leading-normal font-medium tracking-normal text-white">
                        Movie description
                    </p>
                </div>

                <MovieDetails
                    movie={movie}
                    isOwner={isOwner}
                    onEdit={() => setShowEdit(true)}
                    onDelete={() => setShowDeleteConfirm(true)}
                />

                <MovieQuotesHeader quotesCount={movie.quotes?.length ?? 0} />
            </div>
        </AuthenticatedLayout>
    );
}
