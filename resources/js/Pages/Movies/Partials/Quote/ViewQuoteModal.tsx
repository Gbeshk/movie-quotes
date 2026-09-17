import EditImagePreview from '@/Components/Shared/EditImagePreview';
import CommentIcon from '@/Components/Shared/Icons/CommentIcon';
import EditIcon from '@/Components/Shared/Icons/EditIcon';
import HeartIcon from '@/Components/Shared/Icons/HeartIcon';
import TrashIcon from '@/Components/Shared/Icons/TrashIcon';
import Modal from '@/Components/Shared/Modal';
import { useQuoteLike } from '@/hooks/useQuoteLike';
import PostComment from '@/Pages/Feed/Partials/PostComment';
import PostCommentForm from '@/Pages/Feed/Partials/PostCommentForm';
import ModalHeader from '@/Pages/Movies/Partials/ModalHeader';
import ModalUserRow from '@/Pages/Movies/Partials/ModalUserRow';
import QuoteFormFields from '@/Pages/Movies/Partials/Quote/QuoteFormFields';
import { Comment, Quote, QuoteFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const INITIAL_COMMENTS_SHOWN = 2;
const COMMENTS_PAGE_SIZE = 3;

export default function ViewQuoteModal({
    show,
    onClose,
    quote,
    isAuthor,
    onEdit,
    onDelete,
}: {
    show: boolean;
    onClose: () => void;
    quote: Quote;
    isAuthor: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const { t } = useTranslation();
    const { data, setData, errors, clearErrors } = useForm<QuoteFormData>({
        text: { ka: quote.text.ka, en: quote.text.en },
        image: null,
    });
    const { liked, likesCount, toggleLike } = useQuoteLike(quote);
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const comments = [...localComments, ...(quote.comments ?? [])];
    const [visibleCount, setVisibleCount] = useState(INITIAL_COMMENTS_SHOWN);
    const visibleComments = comments.slice(0, visibleCount);
    const hasMoreComments = visibleCount < comments.length;
    const canShowLess = visibleCount > INITIAL_COMMENTS_SHOWN;

    return (
        <Modal
            show={show}
            onClose={onClose}
            cardClassName="w-225 max-h-[90vh] max-sm:w-full overflow-y-auto py-10 pb-18"
            cardBgClassName="bg-profile-modal-bg"
            backdropClassName=""
        >
            {isAuthor && (
                <div className="absolute top-10 left-8 flex items-center gap-6">
                    <button type="button" onClick={onEdit} className="cursor-pointer">
                        <EditIcon />
                    </button>
                    <div className="bg-modal-secondary-text h-4 w-px" />
                    <button type="button" onClick={onDelete} className="cursor-pointer">
                        <TrashIcon />
                    </button>
                </div>
            )}
            <ModalHeader title={t('movies.viewQuoteTitle')} onClose={onClose} />
            <ModalUserRow />
            <QuoteFormFields
                data={data}
                setData={setData}
                errors={errors}
                textareaHeightClassName="h-13"
            />
            <EditImagePreview
                file={data.image}
                existingImageUrl={quote.image_url}
                onChange={(file) => {
                    setData('image', file);
                    clearErrors('image');
                }}
                error={errors.image}
            />

            <div className="mt-10 flex w-full flex-col px-8">
                <div className="flex h-8 gap-6">
                    <div className="flex items-center gap-3">
                        <p className="text-xl leading-normal font-normal tracking-normal text-white">
                            {comments.length}
                        </p>
                        <CommentIcon />
                    </div>
                    <button
                        type="button"
                        onClick={toggleLike}
                        className="flex cursor-pointer items-center gap-3"
                    >
                        <p className="text-xl leading-normal font-normal tracking-normal text-white">
                            {likesCount}
                        </p>
                        <HeartIcon filled={liked} />
                    </button>
                </div>
                <div className="bg-line mt-6 h-px w-full"></div>
                {visibleComments.map((comment) => (
                    <PostComment key={comment.id} comment={comment} />
                ))}
                {(hasMoreComments || canShowLess) && (
                    <div className="mt-4 flex w-fit gap-6">
                        {hasMoreComments && (
                            <button
                                type="button"
                                onClick={() =>
                                    setVisibleCount((count) => count + COMMENTS_PAGE_SIZE)
                                }
                                className="text-modal-secondary-text cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline"
                            >
                                {t('post.showMoreComments')}
                            </button>
                        )}
                        {canShowLess && (
                            <button
                                type="button"
                                onClick={() => setVisibleCount(INITIAL_COMMENTS_SHOWN)}
                                className="text-modal-secondary-text cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline"
                            >
                                {t('post.showLessComments')}
                            </button>
                        )}
                    </div>
                )}
                <PostCommentForm
                    quoteId={quote.id}
                    onCommentAdded={(comment) =>
                        setLocalComments((current) => [comment, ...current])
                    }
                />
            </div>
        </Modal>
    );
}
