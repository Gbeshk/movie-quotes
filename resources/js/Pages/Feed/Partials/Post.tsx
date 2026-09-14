import CommentIcon from '@/Components/Shared/Icons/CommentIcon';
import HeartIcon from '@/Components/Shared/Icons/HeartIcon';
import UserAvatar from '@/Components/Shared/UserAvatar';
import { useQuoteLike } from '@/hooks/useQuoteLike';
import PostComment from '@/Pages/Feed/Partials/PostComment';
import PostCommentForm from '@/Pages/Feed/Partials/PostCommentForm';
import { Comment, Quote } from '@/types';
import { useState } from 'react';

const INITIAL_COMMENTS_SHOWN = 2;
const COMMENTS_PAGE_SIZE = 3;

export default function Post({ quote }: { quote: Quote }) {
    const { liked, likesCount, toggleLike } = useQuoteLike(quote);
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const comments = [...(quote.comments ?? []), ...localComments];
    const [visibleCount, setVisibleCount] = useState(INITIAL_COMMENTS_SHOWN);
    const visibleComments = comments.slice(0, visibleCount);
    const hasMoreComments = visibleCount < comments.length;
    const canShowLess = visibleCount > INITIAL_COMMENTS_SHOWN;

    return (
        <div className="bg-profile-modal-bg flex flex-col rounded-xl p-6 pb-10 backdrop-blur-3xl">
            <div className="flex items-center gap-4">
                {quote.user && <UserAvatar user={quote.user} />}
                <p className="text-xl leading-normal font-normal text-white">
                    {quote.user?.username}
                </p>
            </div>
            <p className="mt-4 text-xl leading-normal font-normal tracking-normal text-white">
                “{quote.text.en}”
                {quote.movie && (
                    <>
                        {' '}
                        -{' '}
                        <span className="text-logo-text text-xl leading-normal font-medium tracking-normal">
                            {quote.movie.title.en}.
                        </span>{' '}
                        ({quote.movie.release_year})
                    </>
                )}
            </p>
            {quote.image_url && (
                <div className="mt-7 h-125 w-full overflow-hidden rounded-xl">
                    <img src={quote.image_url} alt="" className="h-full w-full object-cover" />
                </div>
            )}
            <div className="mt-6 flex h-8 gap-6">
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
                            onClick={() => setVisibleCount((count) => count + COMMENTS_PAGE_SIZE)}
                            className="text-modal-secondary-text cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline"
                        >
                            Show more comments
                        </button>
                    )}
                    {canShowLess && (
                        <button
                            type="button"
                            onClick={() => setVisibleCount(INITIAL_COMMENTS_SHOWN)}
                            className="text-modal-secondary-text cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline"
                        >
                            Show less comments
                        </button>
                    )}
                </div>
            )}
            <PostCommentForm
                quoteId={quote.id}
                onCommentAdded={(comment) => setLocalComments((current) => [...current, comment])}
            />
        </div>
    );
}
