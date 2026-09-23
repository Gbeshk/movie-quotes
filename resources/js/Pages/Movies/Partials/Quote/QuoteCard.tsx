import ClampText from '@/Components/Shared/ClampText';
import CommentIcon from '@/Components/Shared/Icons/CommentIcon';
import EditIcon from '@/Components/Shared/Icons/EditIcon';
import HeartIcon from '@/Components/Shared/Icons/HeartIcon';
import TrashIcon from '@/Components/Shared/Icons/TrashIcon';
import ViewIcon from '@/Components/Shared/Icons/ViewIcon';
import OptionsMenu from '@/Components/Shared/OptionsMenu';
import { useQuoteLike } from '@/hooks/useQuoteLike';
import { useTranslatable } from '@/lib/translatable';
import PostCommentForm from '@/Pages/Feed/Partials/PostCommentForm';
import { Quote } from '@/types';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function QuoteCard({
    quote,
    isAuthor = false,
    onEdit,
    onDelete,
    onView,
}: {
    quote: Quote;
    isAuthor?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
}) {
    const { t } = useTranslation();
    const translate = useTranslatable();
    const { liked, likesCount, toggleLike } = useQuoteLike(quote);
    const [localCommentsCount, setLocalCommentsCount] = useState(0);
    const commentsCount = (quote.comments_count ?? 0) + localCommentsCount;
    const commentInputRef = useRef<HTMLInputElement>(null);

    const optionsActions = [
        {
            label: t('movies.viewQuote'),
            icon: <ViewIcon />,
            onClick: onView ?? (() => {}),
        },
        ...(isAuthor
            ? [
                  {
                      label: t('common.edit'),
                      icon: <EditIcon />,
                      onClick: onEdit ?? (() => {}),
                  },
                  {
                      label: t('common.delete'),
                      icon: <TrashIcon />,
                      onClick: onDelete ?? (() => {}),
                      variant: 'danger' as const,
                  },
              ]
            : []),
    ];

    return (
        <div className="border-modal-secondary-text bg-profile-modal-bg backdrop-blur-50 relative w-full rounded-xl px-8 py-6 max-sm:rounded-none">
            <div className="absolute top-6 right-8 max-sm:hidden">
                <OptionsMenu actions={optionsActions} />
            </div>
            <div className="flex items-center gap-8 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
                <div className="bg-input-bg h-35 w-56.5 shrink-0 overflow-hidden rounded-lg max-sm:h-50 max-sm:w-full">
                    {quote.image_url && (
                        <img src={quote.image_url} alt="" className="h-full w-full object-cover" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <ClampText
                        className="text-input-bg text-2xl leading-relaxed font-normal tracking-normal wrap-break-word"
                        moreLabel={t('post.seeFullQuote')}
                        lessLabel={t('post.seeLessQuote')}
                        buttonClassName="text-modal-secondary-text mt-2 w-fit cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline"
                    >
                        "<span className="italic">{translate(quote.text)}</span> "
                    </ClampText>
                </div>
            </div>
            <div className="bg-add-movie-line mt-6 h-px w-full"></div>
            <div className="mt-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => commentInputRef.current?.focus()}
                        className="group flex cursor-pointer items-center gap-3"
                    >
                        <p className="text-xl leading-relaxed font-normal tracking-normal text-white">
                            {commentsCount}
                        </p>
                        <CommentIcon />
                    </button>
                    <button
                        type="button"
                        onClick={toggleLike}
                        className="group flex cursor-pointer items-center gap-3"
                    >
                        <p className="text-xl leading-relaxed font-normal tracking-normal text-white">
                            {likesCount}
                        </p>
                        <HeartIcon filled={liked} />
                    </button>
                </div>
                <div className="hidden max-sm:block">
                    <OptionsMenu actions={optionsActions} />
                </div>
            </div>
            <PostCommentForm
                ref={commentInputRef}
                quoteId={quote.id}
                onCommentAdded={() => setLocalCommentsCount((count) => count + 1)}
            />
        </div>
    );
}
