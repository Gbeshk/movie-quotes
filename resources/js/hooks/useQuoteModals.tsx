import ConfirmModal from '@/Components/Shared/ConfirmModal';
import EditQuoteModal from '@/Pages/Movies/Partials/Quote/EditQuoteModal';
import ViewQuoteModal from '@/Pages/Movies/Partials/Quote/ViewQuoteModal';
import { Quote } from '@/types';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useQuoteModals(currentUserId: number) {
    const { t } = useTranslation();
    const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
    const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
    const { delete: destroyQuote, processing: processingQuoteDelete } = useForm();

    const viewQuote = (quoteId: number) => {
        axios.get<Quote>(route('quotes.show', quoteId)).then((response) => {
            setViewingQuote(response.data);
        });
    };

    const confirmDeleteQuote = () => {
        if (deletingQuote) {
            destroyQuote(route('quotes.destroy', deletingQuote.id), {
                onSuccess: () => setDeletingQuote(null),
            });
        }
    };

    const quoteModals = (
        <>
            {viewingQuote && (
                <ViewQuoteModal
                    show
                    onClose={() => setViewingQuote(null)}
                    quote={viewingQuote}
                    isAuthor={viewingQuote.user_id === currentUserId}
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
                title={t('movies.deleteQuoteConfirmTitle')}
                subtitle={t('movies.deleteQuoteConfirmSubtitle')}
                confirmLabel={t('common.delete')}
            />
        </>
    );

    return { viewQuote, quoteModals };
}
