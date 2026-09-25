import { Comment } from '@/types';
import { Dispatch, SetStateAction, useEffect } from 'react';

export function useQuoteRealtime(
    quoteId: number,
    currentUserId: number,
    setLikesCount: Dispatch<SetStateAction<number>>,
    setComments: Dispatch<SetStateAction<Comment[]>>,
) {
    useEffect(() => {
        const channelName = `quote.${quoteId}`;
        const channel = window.Echo.channel(channelName);

        channel.listen('.QuoteLikeToggled', (event: { likes_count: number }) => {
            setLikesCount(event.likes_count);
        });

        channel.listen('.CommentPosted', (event: { comment: Comment }) => {
            if (event.comment.user.id === currentUserId) {
                return;
            }

            setComments((comments) => [event.comment, ...comments]);
        });

        return () => {
            window.Echo.leave(channelName);
        };
    }, [quoteId, currentUserId, setLikesCount, setComments]);
}
