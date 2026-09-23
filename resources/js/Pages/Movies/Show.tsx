import ConfirmModal from '@/Components/Shared/ConfirmModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslatable } from '@/lib/translatable';
import { AuthenticatedPageProps, Movie, Paginated, Quote } from '@/types';
import { Head, InfiniteScroll, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditMovieModal from './Partials/Movie/EditMovieModal';
import MovieDetails from './Partials/Movie/MovieDetails';
import AddQuoteModal from './Partials/Quote/AddQuoteModal';
import EditQuoteModal from './Partials/Quote/EditQuoteModal';
import MovieQuotesHeader from './Partials/Quote/MovieQuotesHeader';
import QuoteCard from './Partials/Quote/QuoteCard';
import ViewQuoteModal from './Partials/Quote/ViewQuoteModal';

export default function Show({
    movie,
    quotes,
    quotesCount,
}: {
    movie: Movie;
    quotes: Paginated<Quote>;
    quotesCount: number;
}) {
    const { t } = useTranslation();
    const translate = useTranslatable();
    const { auth } = usePage<AuthenticatedPageProps>().props;
    const isOwner = auth.user.id === movie.user_id;
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAddQuote, setShowAddQuote] = useState(false);
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
    const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
    const [viewingQuote, setViewingQuote] = useState<Quote | null>(() => {
        const viewQuoteId = new URLSearchParams(window.location.search).get('view_quote');

        return viewQuoteId
            ? (quotes.data.find((quote) => quote.id === Number(viewQuoteId)) ?? null)
            : null;
    });
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

    useEffect(() => {
        if (viewingQuote) {
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [viewingQuote]);

    return (
        <AuthenticatedLayout contentShrink0={false}>
            <Head title={translate(movie.title)} />

            {isOwner && (
                <EditMovieModal show={showEdit} onClose={() => setShowEdit(false)} movie={movie} />
            )}

            <ConfirmModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                confirmDisabled={processing}
                title={t('movies.deleteMovieConfirmTitle')}
                subtitle={t('movies.deleteMovieConfirmSubtitle')}
                confirmLabel={t('common.delete')}
            />

            {isOwner && (
                <AddQuoteModal
                    show={showAddQuote}
                    onClose={() => setShowAddQuote(false)}
                    movie={movie}
                />
            )}

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

            {viewingQuote && (
                <ViewQuoteModal
                    show
                    onClose={() => setViewingQuote(null)}
                    quote={viewingQuote}
                    isAuthor={viewingQuote.user_id === auth.user.id}
                    onEdit={() => {
                        setEditingQuote(viewingQuote);
                        setViewingQuote(null);
                    }}
                    onDelete={() => {
                        setDeletingQuote(viewingQuote);
                        setViewingQuote(null);
                    }}
                />
            )}

            <ConfirmModal
                show={deletingQuote !== null}
                onClose={() => setDeletingQuote(null)}
                onConfirm={confirmDeleteQuote}
                confirmDisabled={processingQuoteDelete}
                title={t('movies.deleteQuoteConfirmTitle')}
                subtitle={t('movies.deleteQuoteConfirmSubtitle')}
                confirmLabel={t('common.delete')}
            />

            <div className="w-full lg:pl-8">
                <div className="w-movie-content max-movie-wrap:w-full ml-auto max-lg:flex max-lg:flex-col max-lg:items-center">
                    <div className="flex items-center justify-between max-sm:hidden">
                        <p className="text-2xl leading-normal font-medium tracking-normal text-white">
                            {t('movies.movieDescription')}
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
                        isOwner={isOwner}
                        onAddQuote={() => setShowAddQuote(true)}
                    />

                    <InfiniteScroll
                        data="quotes"
                        className="w-movie-poster max-movie-wrap:w-movie-poster-wrap md:max-movie-wrap:min-w-160 max-md:w-movie-mobile mt-16 flex flex-col gap-10 max-sm:w-full"
                    >
                        {quotes.data.map((quote) => (
                            <QuoteCard
                                key={quote.id}
                                quote={quote}
                                isAuthor={quote.user_id === auth.user.id}
                                onEdit={() => setEditingQuote(quote)}
                                onDelete={() => setDeletingQuote(quote)}
                                onView={() => setViewingQuote(quote)}
                            />
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
