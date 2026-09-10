import ConfirmModal from '@/Components/Shared/ConfirmModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AuthenticatedPageProps, Movie, Paginated, Quote } from '@/types';
import { Head, InfiniteScroll, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AddQuoteModal from './Partials/AddQuoteModal';
import EditMovieModal from './Partials/EditMovieModal';
import EditQuoteModal from './Partials/EditQuoteModal';
import MovieDetails from './Partials/MovieDetails';
import MovieQuotesHeader from './Partials/MovieQuotesHeader';
import QuoteCard from './Partials/QuoteCard';

export default function Show({
    movie,
    quotes,
    quotesCount,
}: {
    movie: Movie;
    quotes: Paginated<Quote>;
    quotesCount: number;
}) {
    const { auth } = usePage<AuthenticatedPageProps>().props;
    const isOwner = auth.user.id === movie.user_id;
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAddQuote, setShowAddQuote] = useState(false);
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
    const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
    const { delete: destroy, processing } = useForm();
    const { delete: destroyQuote, processing: processingQuoteDelete } = useForm();

    const confirmDelete = () => {
        destroy(route('movies.destroy', movie.id));
    };

    const confirmDeleteQuote = () => {
        if (deletingQuote) {
            destroyQuote(route('quotes.destroy', deletingQuote.id), {
                onSuccess: () => setDeletingQuote(null),
            });
        }
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

            <AddQuoteModal
                show={showAddQuote}
                onClose={() => setShowAddQuote(false)}
                movie={movie}
            />

            {editingQuote && (
                <EditQuoteModal
                    show
                    onClose={() => setEditingQuote(null)}
                    quote={editingQuote}
                    onDelete={() => {
                        setDeletingQuote(editingQuote);
                        setEditingQuote(null);
                    }}
                />
            )}

            <ConfirmModal
                show={deletingQuote !== null}
                onClose={() => setDeletingQuote(null)}
                onConfirm={confirmDeleteQuote}
                confirmDisabled={processingQuoteDelete}
                title="Delete this quote?"
                subtitle="This action cannot be undone."
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

                <MovieQuotesHeader
                    quotesCount={quotesCount}
                    onAddQuote={() => setShowAddQuote(true)}
                />

                <InfiniteScroll data="quotes" className="mt-16 flex w-3/5 flex-col gap-10">
                    {quotes.data.map((quote) => (
                        <QuoteCard
                            key={quote.id}
                            quote={quote}
                            isAuthor={quote.user_id === auth.user.id}
                            onEdit={() => setEditingQuote(quote)}
                            onDelete={() => setDeletingQuote(quote)}
                        />
                    ))}
                </InfiniteScroll>
            </div>
        </AuthenticatedLayout>
    );
}
