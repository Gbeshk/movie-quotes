import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Movie, PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import EditMovieModal from './Partials/EditMovieModal';

export default function Show({ movie }: { movie: Movie }) {
    const { auth } = usePage<PageProps>().props;
    const isOwner = auth.user.id === movie.user_id;

    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { delete: destroy, processing } = useForm();

    const confirmDelete = () => {
        destroy(route('movies.destroy', movie.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {movie.title.en}
                    </h2>

                    {isOwner && (
                        <div className="flex gap-3">
                            <SecondaryButton onClick={() => setShowEdit(true)}>
                                Edit
                            </SecondaryButton>
                            <DangerButton onClick={() => setShowDeleteConfirm(true)}>
                                Delete
                            </DangerButton>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={movie.title.en} />

            {isOwner && (
                <EditMovieModal show={showEdit} onClose={() => setShowEdit(false)} movie={movie} />
            )}

            <Modal show={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Delete this movie?</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        This will also delete all of its quotes. This cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={confirmDelete} disabled={processing}>
                            Delete
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm text-gray-500">Director</dt>
                                <dd className="text-gray-900">{movie.director.en}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">Genre</dt>
                                <dd className="text-gray-900">{movie.genre}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">Release year</dt>
                                <dd className="text-gray-900">{movie.release_year}</dd>
                            </div>
                        </dl>
                        <p className="mt-4 text-gray-700">{movie.description.en}</p>
                    </div>

                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Quotes</h3>

                        {!movie.quotes || movie.quotes.length === 0 ? (
                            <p className="text-sm text-gray-500">No quotes added yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {movie.quotes.map((quote) => (
                                    <li key={quote.id} className="border-b border-gray-100 pb-3">
                                        <p className="text-gray-900">{quote.text.en}</p>
                                        <p className="text-sm text-gray-500">{quote.text.ka}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
