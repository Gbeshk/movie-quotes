import ClampText from '@/Components/Shared/ClampText';
import CommentIcon from '@/Components/Shared/Icons/CommentIcon';
import HeartIcon from '@/Components/Shared/Icons/HeartIcon';
import UserAvatar from '@/Components/Shared/UserAvatar';
import { useQuoteLike } from '@/hooks/useQuoteLike';
import { useTranslatable } from '@/lib/translatable';
import PostComment from '@/Pages/Feed/Partials/PostComment';
import PostCommentForm from '@/Pages/Feed/Partials/PostCommentForm';
import { Comment, Quote } from '@/types';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const INITIAL_COMMENTS_SHOWN = 2;
const COMMENTS_PAGE_SIZE = 3;

export default function Post({ quote }: { quote: Quote }) {
    const { t } = useTranslation();
    const translate = useTranslatable();
    const { liked, likesCount, toggleLike } = useQuoteLike(quote);
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const comments = [...localComments, ...(quote.comments ?? [])];
    const [visibleCount, setVisibleCount] = useState(INITIAL_COMMENTS_SHOWN);
    const visibleComments = comments.slice(0, visibleCount);
    const hasMoreComments = visibleCount < comments.length;
    const canShowLess = visibleCount > INITIAL_COMMENTS_SHOWN;
    const commentInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-profile-modal-bg flex flex-col rounded-xl p-6 pb-10 backdrop-blur-3xl max-sm:rounded-none max-sm:px-8 max-sm:pt-7 max-sm:pb-10">
            <div className="flex items-center gap-4">
                {quote.user && <UserAvatar user={quote.user} className="max-sm:h-10 max-sm:w-10" />}
                <p className="text-xl leading-normal font-normal text-white max-sm:text-base">
                    {quote.user?.username}
                </p>
            </div>
            <ClampText
                className="mt-4 text-xl leading-normal font-normal tracking-normal wrap-break-word text-white max-sm:text-base"
                moreLabel={t('post.seeFullQuote')}
                lessLabel={t('post.seeLessQuote')}
                buttonClassName="text-modal-secondary-text mt-2 w-fit cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline max-sm:text-sm"
            >
                “{translate(quote.text)}”
                {quote.movie && (
                    <>
                        {' '}
                        -{' '}
                        <span className="text-logo-text text-xl leading-normal font-medium tracking-normal max-sm:text-base">
                            {translate(quote.movie.title)}.
                        </span>{' '}
                        ({quote.movie.release_year})
                    </>
                )}
            </ClampText>
            {quote.image_url && (
                <div className="mt-7 h-125 w-full overflow-hidden rounded-xl max-sm:h-50">
                    <img src={quote.image_url} alt="" className="h-full w-full object-cover" />
                </div>
            )}
            <div className="mt-6 flex h-8 gap-6">
                <button
                    type="button"
                    onClick={() => commentInputRef.current?.focus()}
                    className="group flex cursor-pointer items-center gap-3"
                >
                    <p className="text-xl leading-normal font-normal tracking-normal text-white">
                        {comments.length}
                    </p>
                    <CommentIcon className="max-sm:h-6 max-sm:w-6" />
                </button>
                <button
                    type="button"
                    onClick={toggleLike}
                    className="group flex cursor-pointer items-center gap-3"
                >
                    <p className="text-xl leading-normal font-normal tracking-normal text-white">
                        {likesCount}
                    </p>
                    <HeartIcon filled={liked} className="max-sm:h-6 max-sm:w-6" />
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
                            onClick={() => setVisibleCount((count) => count + COMMENTS_PAGE_SIZE)}
                            className="text-modal-secondary-text cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline max-sm:text-sm"
                        >
                            {t('post.showMoreComments')}
                        </button>
                    )}
                    {canShowLess && (
                        <button
                            type="button"
                            onClick={() => setVisibleCount(INITIAL_COMMENTS_SHOWN)}
                            className="text-modal-secondary-text cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline max-sm:text-sm"
                        >
                            {t('post.showLessComments')}
                        </button>
                    )}
                </div>
            )}
            <PostCommentForm
                ref={commentInputRef}
                quoteId={quote.id}
                onCommentAdded={(comment) => setLocalComments((current) => [comment, ...current])}
            />
        </div>
    );
}
