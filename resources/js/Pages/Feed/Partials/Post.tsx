import CommentIcon from '@/Components/Shared/Icons/CommentIcon';
import HeartIcon from '@/Components/Shared/Icons/HeartIcon';
import UserAvatar from '@/Components/Shared/UserAvatar';
import PostComment from '@/Pages/Feed/Partials/PostComment';
import { AuthenticatedPageProps, Quote } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

const INITIAL_COMMENTS_SHOWN = 2;
const COMMENTS_PAGE_SIZE = 3;

export default function Post({ quote }: { quote: Quote }) {
    const { auth } = usePage<AuthenticatedPageProps>().props;
    const comments = quote.comments ?? [];
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
                <div className="flex cursor-pointer items-center gap-3">
                    <p className="text-xl leading-normal font-normal tracking-normal text-white">
                        {quote.comments_count ?? 0}
                    </p>
                    <CommentIcon />
                </div>
                <div className="flex cursor-pointer items-center gap-3">
                    <p className="text-xl leading-normal font-normal tracking-normal text-white">
                        {quote.likes_count ?? 0}
                    </p>
                    <HeartIcon />
                </div>
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
            <div className="mt-6 flex h-13 items-center gap-6">
                <UserAvatar user={auth.user} />
                <input
                    placeholder="Write a comment"
                    className="bg-header-bg/60 text-input-bg placeholder:text-input-bg h-full flex-1 rounded-xl border-0 px-4 text-xl leading-normal font-normal tracking-normal outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
        </div>
    );
}
